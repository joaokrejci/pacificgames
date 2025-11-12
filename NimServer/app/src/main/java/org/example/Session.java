package org.example;

public interface Session {
    boolean join(String clientId);
    boolean doAction(String clientId, String action, Object... args);
    String getStatus();
    boolean isComplete();
}
