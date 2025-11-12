package org.example;

import java.util.ArrayList;
import java.util.List;

public class NimSession implements Session {
    private final int MAXIMUM_NUMBER_OF_PLAYERS = 2;
    private final List<String> players = new ArrayList<>();

    private int numberOfPebbles = 23;
    private int currentPlayer = 0;

    @Override
    public synchronized boolean join(String clientId) {
        if (players.size() < MAXIMUM_NUMBER_OF_PLAYERS && !players.contains(clientId)) {
            players.add(clientId);
            return true;
        }

        return false;
    }

    @Override
    public synchronized boolean doAction(String clientId, String action, Object... args) {
        if (!isValid(clientId)) {
            return false;
        }

        if (action.equals("TAKE")) {
            int pebblesToTake = (Integer) args[0];
            if (pebblesToTake > numberOfPebbles || pebblesToTake < 1 || pebblesToTake > 3) {
                return false;
            }

            numberOfPebbles = numberOfPebbles - pebblesToTake;
        }

        currentPlayer = (currentPlayer + 1) % MAXIMUM_NUMBER_OF_PLAYERS;
        return true;
    }

    private boolean isValid(String clientId) {
        int index = players.indexOf(clientId);
        return players.size() >= MAXIMUM_NUMBER_OF_PLAYERS
                && players.contains(clientId)
                && currentPlayer == index;
    }

    @Override
    public String getStatus() {
        if (players.size() < MAXIMUM_NUMBER_OF_PLAYERS) {
            return "STATUS:INCOMPLETE:" + players.size();
        }

        if (numberOfPebbles == 0) {
            int lastPlayer = (currentPlayer - 1) % MAXIMUM_NUMBER_OF_PLAYERS;
            return "STATUS:OVER:%s".formatted(players.get(lastPlayer));
        }

        return "STATUS:%d:%s".formatted(numberOfPebbles, players.get(currentPlayer));
    }

    @Override
    public boolean isComplete() {
        return players.size() == MAXIMUM_NUMBER_OF_PLAYERS;
    }
}
