package org.example;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class SessionManager {
    private final Class<? extends Session> sessionType;
    private final Map<String, Session> sessionMap = new HashMap<>();
    int nextSession = 0;

    public SessionManager(Class<? extends Session> sessionType) {
        this.sessionType = sessionType;
    }

    public String join(String playerId) {
        for (Map.Entry<String, Session> entry : sessionMap.entrySet()) {
            Session session = entry.getValue();
            if (!session.isComplete()) {
                session.join(playerId);
                return entry.getKey();
            }
        }

        String sessionId = "session_" + nextSession++;
        Session session = createSessionInstance();
        session.join(playerId);
        sessionMap.put(sessionId, session);

        return sessionId;
    }

    private Session createSessionInstance() {
        Session newSessionInstance;
        try {
            newSessionInstance = sessionType.getDeclaredConstructor().newInstance();
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
        return newSessionInstance;
    }

    public Session get(String sessionId) {
        return sessionMap.get(sessionId);
    }
}
