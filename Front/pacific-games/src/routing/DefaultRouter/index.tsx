import { Navigate, Route, Routes } from "react-router";

import Games from "../../screen/Games";
import Nim from "../../screen/Nim";
import Player from "../../screen/Player";
import { PlayerContext } from "../../context/player-context";
import { PrivateRoute } from "../PrivateRoute";
import TicTacToe from "../../screen/TicTacToe";
import ConnectFour from "../../screen/ConnectFour";
import { useContext } from "react";

const Paths = {
    ROOT: '/',
    GAMES: '/games',
    TICTACTOE: '/tictactoe',
    NIM: '/nim',
    CONNECTFOUR: '/connectfour'
}

function DefaultRouter() {
    const [player] = useContext(PlayerContext)

    return (
        <Routes>
            <Route
                index
                element={player?.id ? <Navigate to={Paths.GAMES} /> : <Player />}
            />
            <>
                <Route
                    path={Paths.GAMES}
                    element={
                        <PrivateRoute>
                            <Games />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={Paths.TICTACTOE}
                    element={
                        <PrivateRoute>
                            <TicTacToe />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={Paths.NIM}
                    element={
                        <PrivateRoute>
                            <Nim />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={Paths.CONNECTFOUR}
                    element={
                        <PrivateRoute>
                            <ConnectFour />
                        </PrivateRoute>
                    }
                />
            </>
        </Routes>
    )
}

export { Paths, DefaultRouter }