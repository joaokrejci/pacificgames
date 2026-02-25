import { Navigate, Route, Routes } from "react-router";

import Games from "../../screen/Games";
import Player from "../../screen/Player";
import { PlayerContext } from "../../context/player-context";
import { PrivateRoute } from "../PrivateRoute";
import TicTacToe from "../../screen/TicTacToe";
import { useContext } from "react";

const Paths = {
    ROOT: '/',
    GAMES: '/games',
    TICTACTOE: '/tictactoe',
}

function DefaultRouter() {
    const [player] = useContext(PlayerContext)

    return (
        <Routes>
            <Route
                index
                element={player?.id ? <Navigate to={Paths.GAMES} /> : <Player />}
            />
            <PrivateRoute
                path={Paths.GAMES}
                element={<Games />}
            />
            <PrivateRoute
                path={Paths.TICTACTOE}
                element={<TicTacToe />}
            />
        </Routes>
    )
}

export { Paths, DefaultRouter }