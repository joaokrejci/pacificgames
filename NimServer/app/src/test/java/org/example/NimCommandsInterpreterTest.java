package org.example;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class NimCommandsInterpreterTest {
    CommandInterpreter interpreter = new NimCommandsInterpreter(new SessionManager(NimSession.class));
    @Test
    public void shouldIdentify() {
        String res = interpreter.interpretCommand("IDENTIFY");
        Assertions.assertEquals("IDENTITY:NIM", res);
    }

    @Test
    public void shouldNotAllowInvalidCommand() {
        String res = interpreter.interpretCommand("INVALID");
        Assertions.assertEquals("ERROR:UNKNOWN_COMMAND", res);
    }
}
