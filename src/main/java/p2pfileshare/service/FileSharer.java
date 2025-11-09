package p2pfileshare.service;

import p2pfileshare.utils.UploadUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

public class FileSharer {

    //port to filepath mapping
    private HashMap<Integer, String> availableFiles;

    public FileSharer() {
        availableFiles = new HashMap<>();
    }

    public int assignAvailablePort(String filePath) {
        int port;
        while(true) {
            port = UploadUtils.getRandomDynamicPort();
            if(!availableFiles.containsKey(port)) {
                availableFiles.put(port, filePath);
                return port;
            }
        }
    }

    public void startFileServer(int port) {
        String filePath = availableFiles.get(port);
        if(filePath == null) {
            System.err.println("No file shared on port: " + port);
            return;
        }

        try(ServerSocket serverSocket = new ServerSocket(port)){
            Socket clientSocket = serverSocket.accept();
            new Thread(new FileSharerHandler(clientSocket, filePath)).start();
        } catch (Exception ex) {
            System.err.println("Error starting file server on port: " + port + ":" + ex.getMessage());
        }
    }

    private static class FileSharerHandler implements Runnable {
        private final Socket clientSocket;
        private final String filePath;

        public FileSharerHandler(Socket clientSocket, String filePath) {
            this.clientSocket = clientSocket;
            this.filePath = filePath;
        }

        @Override
        public void run() {
            try (FileInputStream fis = new FileInputStream(filePath);
                 OutputStream oss = clientSocket.getOutputStream()) {

                String filename = new File(filePath).getName();
                String header = "Filename: " + filename + "\n";
                oss.write(header.getBytes());

                byte[] buffer = new byte[4096];
                int bytesRead;
                while((bytesRead = fis.read(buffer)) != -1) {
                    oss.write(buffer, 0, bytesRead);
                }
                System.out.println(filename + " file sent to " + clientSocket.getInetAddress());
            } catch (Exception e) {
                System.err.println("Error sending file to client: " + e.getMessage());
            } finally {
                try{
                    clientSocket.close();
                } catch (Exception e) {
                    System.err.println("Could not close the client socket: " + e.getMessage());
                }
            }
        }
    }

}
