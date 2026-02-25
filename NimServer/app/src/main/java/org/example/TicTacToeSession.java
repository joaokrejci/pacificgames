package org.example;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class TicTacToeSession implements Session {
    private enum Form {
        CIRCLE("circle"),
        CROSS("cross");

        public final String name;

        Form(String name) {
            this.name = name;
        }
    }

    private final int MAXIMUM_NUMBER_OF_PLAYERS = 2;
    private final List<String> players = new ArrayList<>();
    private final Form[][] board = new Form[3][3];

    private int currentPlayer;
    private int winner = -1;

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

        if (action.equals("PLACE")) {
            String[] xy = ((String) args[0]).split("");
            int x = Integer.parseInt(xy[0]);
            int y = Integer.parseInt(xy[1]);

            if (isOutsideGrid(x,y)) return false;

            if (board[x][y] == null) {
                board[x][y] = getPlayerForm();
            } else {
                return false;
            }
        }
        else {
            return false;
        }

        winner = checkEnding();
        currentPlayer = (currentPlayer + 1) % MAXIMUM_NUMBER_OF_PLAYERS;
        return true;
    }

    private int checkEnding() {
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != null) {
                return playerFromForm(board[i][0]);
            }
            if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != null) {
                return playerFromForm(board[0][i]);
            }
        }
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != null) {
            return playerFromForm(board[0][0]);
        }
        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != null) {
            return playerFromForm(board[0][2]);
        }

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == null) return -1;
            }
        }

        return 2;
    }

    private int playerFromForm(Form form) {
        if (form == Form.CROSS) return 0;
        return 1;
    }

    private Form getPlayerForm() {
        if (currentPlayer == 0) return Form.CROSS;
        return Form.CIRCLE;
    }

    private static boolean isOutsideGrid(int x, int y) {
        return x < 0 || y < 0 || x >= 3 || y >= 3;
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

        if (winner == 2) {
            return "STATUS:OVER:TIE";
        }
        if (winner < 0) {
            String strBoard = Arrays.stream(board).flatMap(form -> Arrays.stream(form).map(f -> f == null ? "" : f.name)).collect(Collectors.joining(","));
            return "STATUS:%s:%s".formatted(strBoard, players.get(currentPlayer));
        }

        return "STATUS:OVER:" + players.get(winner);
    }

    @Override
    public boolean isComplete() {
        return players.size() == MAXIMUM_NUMBER_OF_PLAYERS;
    }
}
