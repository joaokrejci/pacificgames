package org.example;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SocketCommandReader extends Thread {
    private static final Logger LOGGER = Logger.getLogger(SocketCommandReader.class.getName());
    private static final ExecutorService CLIENTS_POOL = Executors.newVirtualThreadPerTaskExecutor();

    private ServerSocket serverSocket;
    private final CommandInterpreter commandInterpreter;

    public SocketCommandReader(CommandInterpreter commandInterpreter) {
        this.commandInterpreter = commandInterpreter;
    }

    @Override
    public void run() {
        int port = getPort();
        try {
            serverSocket = new ServerSocket(port);
            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                socket.setSoTimeout(Duration.ofSeconds(60).toMillisPart());

                CLIENTS_POOL.submit(() -> handleConnection(socket));
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Failed to start server on port: {}", port);
        }
    }

    private static int getPort() {
        return Optional
                .ofNullable(Config.instance.get("server.port"))
                .map(port -> (Integer) port)
                .orElse(6000);
    }

    private void handleConnection(Socket socket) {
        try (
                InputStream inputStream = socket.getInputStream();
                OutputStream outputStream = socket.getOutputStream()
        ) {
            String response = "";
            while (!response.equals("BYE")) {
                response = readCommand(inputStream);
                writeResponse(outputStream, response);
            }
        } catch (IOException e) {
            LOGGER.log(
                    Level.SEVERE,
                    "Connection error on [{}:{}]: {}",
                    new Object[]{
                            socket.getInetAddress().getHostAddress(),
                            socket.getPort(),
                            e.getMessage()
                    });
        }
    }

    private String readCommand(InputStream inputStream) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        String line = bufferedReader.readLine();
        return this.commandInterpreter.interpretCommand(line);
    }

    private static void writeResponse(OutputStream outputStream, String response) throws IOException {
        outputStream.write(response.getBytes());
        outputStream.write("\n".getBytes());
        outputStream.flush();
    }
}
