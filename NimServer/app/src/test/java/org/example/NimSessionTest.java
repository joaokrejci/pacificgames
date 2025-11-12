package org.example;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class NimSessionTest {
    @Test
    void shouldOnlyAccept2Players() {
        NimSession nimSession = new NimSession();
        Assertions.assertTrue(nimSession.join("1"));
        Assertions.assertTrue(nimSession.join("2"));
        Assertions.assertFalse(nimSession.join("3"));
    }

    @Test
    void shouldNotAllowInvalidClientDoAction() {
        Session nimSession = new NimSession();
        nimSession.join("1");
        nimSession.join("2");
        boolean res = nimSession.doAction("3", "TAKE", 1);
        Assertions.assertFalse(res);
    }

    @Test
    void shouldNotAllowActionOnIncompleteSession() {
        Session nimSession = new NimSession();

        boolean res1 =  nimSession.doAction("1", "TAKE", 1);
        String status1 = nimSession.getStatus();

        nimSession.join("1");
        boolean res2 = nimSession.doAction("1", "TAKE", 1);
        String status2 = nimSession.getStatus();

        nimSession.join("2");
        boolean res3 = nimSession.doAction("1", "TAKE", 1);
        String status3 = nimSession.getStatus();

        boolean res4 = nimSession.doAction("2", "TAKE", 1);
        String status4 = nimSession.getStatus();

        Assertions.assertFalse(res1);
        Assertions.assertFalse(res2);
        Assertions.assertTrue(res3);
        Assertions.assertTrue(res4);

        Assertions.assertEquals("STATUS:INCOMPLETE:0", status1);
        Assertions.assertEquals("STATUS:INCOMPLETE:1", status2);
        Assertions.assertNotEquals("STATUS:INCOMPLETE:1", status3);
        Assertions.assertNotEquals("STATUS:INCOMPLETE:1", status4);
    }

    @Test
    void shouldNotAllowPlayersOutOfOrder() {
        Session nimSession = new NimSession();
        nimSession.join("1");
        nimSession.join("2");
        boolean res = nimSession.doAction("2", "TAKE", 1);
        boolean res1 = nimSession.doAction("1", "TAKE", 1);
        boolean res2 = nimSession.doAction("1", "TAKE", 1);
        boolean res3 = nimSession.doAction("2", "TAKE", 1);

        Assertions.assertFalse(res);
        Assertions.assertTrue(res1);
        Assertions.assertFalse(res2);
        Assertions.assertTrue(res3);
    }

    @Test
    void shouldDoAction() {
        Session nimSession = new NimSession();
        nimSession.join("PLAYER_1");
        nimSession.join("PLAYER_2");

        boolean res = nimSession.doAction("PLAYER_1", "TAKE", 1);
        String status1 = nimSession.getStatus();

        boolean res2 = nimSession.doAction("PLAYER_2", "TAKE", 2);
        String status2 = nimSession.getStatus();

        Assertions.assertTrue(res);
        Assertions.assertEquals("STATUS:22:PLAYER_2", status1);

        Assertions.assertEquals("STATUS:20:PLAYER_1", status2);
    }

    @Test
    void shouldNotAllowNegativeNumberOfPebbles() {
        NimSession nimSession = new NimSession();
        nimSession.join("PLAYER_1");
        nimSession.join("PLAYER_2");

        for (int i = 0; i < 11; i++) {
            nimSession.doAction("PLAYER_1", "TAKE", 1);
            nimSession.doAction("PLAYER_2", "TAKE", 1);
        }

        boolean res = nimSession.doAction("PLAYER_1", "TAKE", 2);
        Assertions.assertFalse(res);

        res = nimSession.doAction("PLAYER_1", "TAKE", 1);
        String status = nimSession.getStatus();

        Assertions.assertTrue(res);
        Assertions.assertEquals("STATUS:OVER:PLAYER_1", status);
    }
}
