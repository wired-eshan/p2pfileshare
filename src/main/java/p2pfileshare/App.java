package p2pfileshare;

import p2pfileshare.controller.FileController;

import java.io.IOException;

public class App {
    public static void main(String[] args) {
        try {
            FileController fileController = new FileController(8080);
            fileController.start();
            System.out.println("p2pfileshare sever started on port 8080");

            Runtime.getRuntime().addShutdownHook(new Thread(
                    () -> {
                        System.out.println("Shutting down server");
                        fileController.stop();
                    }
            ));

            // Wait for user to press ENTER
            System.in.read();
            System.out.println("Stopping server...");
            fileController.stop();
            System.out.println("Server stopped.");
        } catch (IOException e) {
            System.err.println("Error starting server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
