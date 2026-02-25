import "./App.css";

import { Navigate, Route, Routes, useNavigate } from "react-router";

import Games from "./screen/Games";
import Player from "./screen/Player";
import TicTacToe from "./screen/TicTacToe";

function App() {
  const navigate = useNavigate();
  function logout() {
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  const player = sessionStorage.getItem("Player-Info");
  return (
    <>
      <header>
        <h1>Pacific Games</h1>
        <div>
          {player && (
            <>
              <span id="welcome-header">
                Olá, {JSON.parse(player).name}
              </span>
              <button onClick={logout} id="exit-button">
                Sair
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route
            index
            element={player ? <Navigate to="/games" /> : <Player />}
          />
          <Route
            path="/games"
            element={player ? <Games /> : <Navigate to="/" />}
          />
          <Route
            path="/tictactoe"
            element={player ? <TicTacToe /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
