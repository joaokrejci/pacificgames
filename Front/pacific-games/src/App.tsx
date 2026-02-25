import "./App.css";

import { Navigate, Route, Routes, useNavigate } from "react-router";

import Games from "./screen/Games";
import Player from "./screen/Player";
import { PlayerContext } from "./context/player-context";
import { PrivateRoute } from "./routing/PrivateRoute";
import TicTacToe from "./screen/TicTacToe";
import { useContext } from "react";

function App() {
  const navigate = useNavigate();
  function logout() {
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  const [player] = useContext(PlayerContext)

  return (
    <>
      <header>
        <h1>Pacific Games</h1>
        <div>
          {player?.id && (
            <>
              <span id="welcome-header">
                Olá, {player.name}
              </span>
              <button onClick={logout} id="exit-button">
                Sair
              </button>
            </>
          )}
        </div>
      </header>

      <main>

      </main>
    </>
  );
}

export default App;
