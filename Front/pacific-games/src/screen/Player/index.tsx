import "./style.css"

import { API, SessionKeys } from "../../global";

import { useNavigate } from "react-router";
import { useRequest } from "../../hooks";
import { useState } from "react";

function Player() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>();
  const registerPlayer = useRequest({
    path: API.registerPlayer,
  });

  async function handlePlayerInput() {
    const player = await registerPlayer({ name: playerName });
    sessionStorage.setItem(SessionKeys.PLAYER_INFO, JSON.stringify(player));
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
