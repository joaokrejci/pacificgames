package org.example;

import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

public class NimCommandsInterpreter implements CommandInterpreter {
    private static final Logger LOGGER = Logger.getLogger(NimCommandsInterpreter.class.getName());
    private final SessionManager sessionManager;

    public NimCommandsInterpreter(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public String interpretCommand(String rawCommand) {
        System.out.println("Command received: " + rawCommand);
        try {
            String[] parts = rawCommand.split(":");
            String command = parts[0];
            String arg1 = parts.length > 1 ? parts[1] : null;
            String arg2 = parts.length > 2 ? parts[2] : null;
            String arg3 =  parts.length > 3 ? parts[3] : null;

            if (command.equalsIgnoreCase("IDENTIFY")) {
                return Config.instance.get("server.type");
            }
            if (command.equalsIgnoreCase("CLOSE")) {
                return "BYE";
            }
            if (command.equalsIgnoreCase("JOIN_SESSION")) {
                if (arg1 == null) {
                    return "ERROR:PLAYER_ID_REQUIRED";
                }
                return "SESSION:%s".formatted(sessionManager.join(arg1));
            }
            if (command.equalsIgnoreCase("SESSION_STATUS")) {
                if (arg1 == null) {
                    return "ERROR:SESSION_ID_REQUIRED";
                }

                Session session = sessionManager.get(arg1);
                if (session == null) {
                    return "ERROR:SESSION_NOT_FOUND";
                }

                return session.getStatus();
            }
            if (command.equalsIgnoreCase("LEAVE")) {
                if (arg1 == null || arg2 == null) {
                    return "ERROR:ARGS_REQUIRED";
                }
                boolean left = sessionManager.leaveSession(arg2, arg1);
                return left ? "STATUS:OK" : "ERROR:LEAVE_FAILED";
            }

            Session session = sessionManager.get(arg2);
            if (session == null) {
                return "ERROR:INVALID_SESSION";
            }
            boolean success = session.doAction(arg1, command.toUpperCase(), arg3);
            if (success) {
                return session.getStatus();
            } else {
                return "ERROR:INVALID_ACTION;\nSESSION_"+session.getStatus();
            }

        } catch (Exception e) {
            LOGGER.log(Level.WARNING, e.getMessage());
            return "ERROR:INVALID_COMMAND";
        }
    }
}
