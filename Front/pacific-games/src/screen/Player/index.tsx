import "./style.css"

import { API, SessionKeys } from "../../global";
import { useContext, useState } from "react";

import { Paths } from "../../routing/DefaultRouter";
import { PlayerContext } from "../../context";
import { useNavigate } from "react-router";
import { useRequest } from "../../hooks";

function Player() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>();
  const registerPlayer = useRequest({
    path: API.registerPlayer,
  });
  const [,setPlayer] = useContext(PlayerContext)

  async function handlePlayerInput() {
    const player = await registerPlayer({ name: playerName });
    setPlayer(player)
    navigate(Paths.GAMES, { replace: true });
  }

  return (
    <div className="Player card">
      <label htmlFor="PlayerName">Nome do jogador: </label>
      <input
        onChange={(ev) => setPlayerName(ev.target.value)}
        id="PlayerName"
      ></input>
      <button onClick={handlePlayerInput}>OK</button>
    </div>
  );
}

export default Player;
