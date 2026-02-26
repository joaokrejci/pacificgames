import { API, Games } from "../global";
import { PlayerContext, SessionContext } from "../context";
import { useContext, useRef, useState } from "react";

import { useRequest } from "./useRequest";

interface Board {
  info: string;
  nextPlayer: string;
}

const GameState = {
  NO_SESSION: 0,
  GETTING_SESSION: 1,
  GOT_SESSION: 2,
  SUBSCRIBING: 3,
  WAITING: 4,
  READY: 5,
  OVER: 6
}

type ActionFunction = (action: object) => void;

const useGame = function (gameType: string) {
  const [session, setSession] = useContext(SessionContext);
  const [player] = useContext(PlayerContext)
  
  const [status, setStatus] = useState(
    session?.id ? GameState.GOT_SESSION : GameState.NO_SESSION
  );
  
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [winner, setWinner] = useState<string | undefined>(undefined);

  const requestJoinSession = useRequest({ path: API.joinSession });

  const sendAction = useRef<ActionFunction>(() => { });

  if (status === GameState.NO_SESSION) {
    setStatus(GameState.GETTING_SESSION);
    requestJoinSession({
      action: "join_session",
      player: player,
      game: gameType,
    })
      .then((result) => {
        if (result.type === "SESSION") {
          setStatus(GameState.GOT_SESSION);
          setSession(result.data);
        }
        if (result.type === "ERROR") {
          setTimeout(() => {
            setStatus(GameState.NO_SESSION);
          }, 5000);
        }
      });
  }

  if (status === GameState.GOT_SESSION) {
    setStatus(GameState.SUBSCRIBING);
    const ws = new WebSocket(`${API.URL}${API.game}`);
    function subscribeToSession() {
      const command = {
        action: "subscribe_to_session",
        session: session,
        game: gameType,
      };
      ws.send(JSON.stringify(command));
    }

    ws.onopen = function () {
      subscribeToSession();
      sendAction.current = (action: object) => {
        ws.send(JSON.stringify({ ...action, game: Games.TIC_TAC_TOE }));
      };
    };

    // eslint-disable-next-line react-hooks/refs
    const interval = setInterval(() => subscribeToSession(), 3000);

    ws.onmessage = function (event) {
      const payload = JSON.parse(event.data);

      if (payload.type === "STATUS") {
        clearInterval(interval);
        if (payload.data?.status === "INCOMPLETE") {
          setStatus(GameState.WAITING);
        }
        if (payload.data?.status === "BOARD") {
          setStatus(GameState.READY);
          setBoard(payload.data);
        }
        if (payload.data?.status === "OVER") {
          setStatus(GameState.OVER);
          setWinner(payload.data?.info);
        }
      }
      if (payload.type === "SESSION") {
        setSession(payload.data);
      }
    };
  }

  function restartSession() {
    setSession({});
    setStatus(GameState.NO_SESSION);
    setBoard(undefined);
    setWinner(undefined);
  }

  return { status, board, winner, sendAction, restartSession };
};

export { useGame, GameState };
