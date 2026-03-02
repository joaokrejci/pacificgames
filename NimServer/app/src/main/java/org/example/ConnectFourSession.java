package org.example;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ConnectFourSession implements Session {

    private enum Piece {
        RED("red"),
        YELLOW("yellow");

        public final String name;

        Piece(String name) {
            this.name = name;
        }
    }

    private static final int ROWS = 6;
    private static final int COLS = 7;
    private static final int MAXIMUM_NUMBER_OF_PLAYERS = 2;

    private final List<String> players = new ArrayList<>();
    private final Piece[][] board = new Piece[ROWS][COLS];

    private int currentPlayer = 0;
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
    public synchronized boolean leave(String clientId) {
        return players.remove(clientId);
    }

    @Override
    public synchronized boolean doAction(String clientId, String action, Object... args) {
        if (!isValid(clientId)) return false;
        if (!action.equals("PLACE")) return false;

        int col;
        try {
            col = Integer.parseInt((String) args[0]);
        } catch (NumberFormatException e) {
            return false;
        }

        if (col < 0 || col >= COLS) return false;

        int row = -1;
        for (int r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] == null) {
                row = r;
                break;
            }
        }
        if (row == -1) return false; // column is full

        board[row][col] = currentPlayer == 0 ? Piece.RED : Piece.YELLOW;

        winner = checkWinner(row, col);
        currentPlayer = (currentPlayer + 1) % MAXIMUM_NUMBER_OF_PLAYERS;
        return true;
    }

    private int checkWinner(int row, int col) {
        Piece piece = board[row][col];
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};

        for (int[] d : directions) {
            int count = 1;
            count += countDirection(row, col, d[0], d[1], piece);
            count += countDirection(row, col, -d[0], -d[1], piece);
            if (count >= 4) return currentPlayer;
        }

        for (int c = 0; c < COLS; c++) {
            if (board[0][c] == null) return -1;
        }
        return 2;
    }

    private int countDirection(int row, int col, int dr, int dc, Piece piece) {
        int count = 0;
        int r = row + dr, c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] == piece) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
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
        if (winner >= 0) {
            return "STATUS:OVER:" + players.get(winner);
        }
        String strBoard = Arrays.stream(board)
                .flatMap(r -> Arrays.stream(r).map(p -> p == null ? "" : p.name))
                .collect(Collectors.joining(","));
        return "STATUS:%s:%s".formatted(strBoard, players.get(currentPlayer));
    }

    @Override
    public boolean isComplete() {
        return players.size() == MAXIMUM_NUMBER_OF_PLAYERS;
    }
}
