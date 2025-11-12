package org.example;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SessionManagerTest {
    @Test
    void shouldCreateNewSessionIfJoiningAndDoesNotExist() {
        SessionManager sessionManager = new SessionManager(NimSession.class);
        String sessionId = sessionManager.join("PLAYER_1");
        Assertions.assertNotNull(sessionId);
    }

    @Test
    void shouldJoinExistingSession() {
        SessionManager sessionManager = new SessionManager(NimSession.class);
        String sessionId = sessionManager.join("PLAYER_1");
        String sessionId2 = sessionManager.join("PLAYER_2");

        Assertions.assertEquals(sessionId, sessionId2);
    }

    @Test
    void shouldCreateDifferentSessionIfPreviousIsFull() {
        SessionManager sessionManager = new SessionManager(NimSession.class);
        String sessionId = sessionManager.join("PLAYER_1");
        String sessionId2 = sessionManager.join("PLAYER_2");
        String sessionId3 = sessionManager.join("PLAYER_3");

        Assertions.assertEquals(sessionId, sessionId2);
        Assertions.assertNotEquals(sessionId, sessionId3);
    }

    @Test
    void shouldGetExistingSession() {
        SessionManager sessionManager = new SessionManager(NimSession.class);
        String sessionId = sessionManager.join("PLAYER_1");
        String sessionId2 = sessionManager.join("PLAYER_2");

        Session session = sessionManager.get(sessionId);
        Session session2 = sessionManager.get(sessionId2);
        Assertions.assertNotNull(session);
        Assertions.assertInstanceOf(NimSession.class, session);
        Assertions.assertEquals(session, session2);

    }
}
