package p2pfileshare.utils;

import java.util.Random;

public class UploadUtils {

    public static Integer getRandomDynamicPort() {
        int DYNAMIC_PORT_START = 49152;
        int DYNAMIC_PORT_END = 65535;

        Random randomPort = new Random();
        return randomPort.nextInt(DYNAMIC_PORT_END - DYNAMIC_PORT_START) + DYNAMIC_PORT_START;
    }
}
