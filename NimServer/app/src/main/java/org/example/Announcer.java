package org.example;

import java.io.IOException;
import java.net.*;
import java.util.Objects;
import java.util.logging.Logger;

public class Announcer extends Thread {
    private static final Logger LOGGER = Logger.getLogger(Announcer.class.getName());

    @Override
    public void run() {
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true);

            var broadcastAddress = getBroadcastAddress();
            if (broadcastAddress == null) return;

            while (true) {
                String type = Config.instance.get("server.type");
                int port = Config.instance.get("server.port");
                String payload = String.format("PG:%s:%d", type, port);

                DatagramPacket packet = new DatagramPacket(payload.getBytes(), payload.length(), broadcastAddress, 17000);
                socket.send(packet);

                Thread.sleep(10000);
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    private static InetAddress getBroadcastAddress() throws SocketException {
        var interfaces = NetworkInterface.getNetworkInterfaces();
        while (interfaces.hasMoreElements()) {
            var ni = interfaces.nextElement();
            if (ni.isLoopback() || !ni.isUp()) continue;
            var broadcast = ni.getInterfaceAddresses()
                    .stream()
                    .map(InterfaceAddress::getBroadcast)
                    .filter(Objects::nonNull)
                    .findAny()
                    .orElse(null);
            if (broadcast != null) return broadcast;
        }
        try {
            return InetAddress.getByName("255.255.255.255");
        } catch (Exception e) {
            return null;
        }
    }
}

