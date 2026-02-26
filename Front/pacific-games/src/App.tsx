import "./App.css";

import { DefaultRouter } from "./routing/DefaultRouter";
import { PlayerContext } from "./context/player-context";
import { SessionContext } from "./context";
import { useContext } from "react";
import { useNavigate } from "react-router";

function App() {
  const [player, setPlayer] = useContext(PlayerContext)
  const [, setSession] = useContext(SessionContext)

  const navigate = useNavigate();
  function logout() {
    sessionStorage.clear();
    setPlayer({id: '', name: ''});
    setSession({})
    navigate("/", { replace: true });
  }

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
        <DefaultRouter />
      </main>
    </>
  );
}

export default App;
