import "./style.css"

import { useNavigate } from "react-router";
import useRequest from "../../hooks/useRequest";
import { useState } from "react";

function Player() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>();
  const registerPlayer = useRequest({
    path: "/register-player",
  });

  async function handlePlayerInput() {
    const player = await registerPlayer({ name: playerName });
    sessionStorage.setItem("Player-Info", JSON.stringify(player));
    navigate("/games", { replace: true });
  }

  return (
    <div className="Player card">
      <label htmlFor="PlayerName">Nome do jogador: </label>
      <input
        onChange={(ev) => setPlayerName(ev.target.value)}
        id="PlayerName"
      ></input>
      <button onClick={handlePlayerInput}>Ok</button>
    </div>
  );
}

export default Player;
