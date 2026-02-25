import { useRef, useState } from "react";

import { SessionKeys } from "../global/session";
import { useRequest } from "./useRequest";

interface Board {
  info: string;
  nextPlayer: string;
}

type ActionFunction = (action: object) => void;

const useGame = function (gameType: string) {
  const playerStorage = sessionStorage.getItem(SessionKeys.PLAYER_INFO);
  const playerInfo = JSON.parse(playerStorage ?? '{}')
  const sessionInfo = sessionStorage.getItem(SessionKeys.SESSION_INFO);
  const sessionObj = JSON.parse(sessionInfo ?? "{}");

  const [session, setSession] = useState(sessionObj);
  const [status, setStatus] = useState(
    sessionObj?.id ? "got-session" : "no-session",
  );
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [winner, setWinner] = useState<string | undefined>(undefined);

  const requestJoinSession = useRequest({ path: '/join-session' });

  const sendAction = useRef<ActionFunction>(() => { });

  if (status === "no-session") {
    setStatus("getting-session");
    requestJoinSession({
      action: "join_session",
      player: playerInfo,
      game: gameType,
    })
      .then((result) => {
        if (result.type === "SESSION") {
          setStatus("got-session");
          setSession(result.data);
          sessionStorage.setItem(SessionKeys.SESSION_INFO, JSON.stringify(result.data));
        }
        if (result.type === "ERROR") {
          setTimeout(() => {
            setStatus("no-session");
          }, 5000);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (status === "got-session") {
    setStatus("subscribing-session");
    const ws = new WebSocket(`${import.meta.env.VITE_API_URL}/game`);
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
        ws.send(JSON.stringify({ ...action, game: "tictactoe" }));
      };
    };

    // eslint-disable-next-line react-hooks/refs
    const interval = setInterval(() => subscribeToSession(), 3000);

    ws.onmessage = function (event) {
      const payload = JSON.parse(event.data);
      
      if (payload.type === "STATUS") {
        clearInterval(interval);
        if (payload.data?.status === "INCOMPLETE") {
          setStatus("waiting");
        }
        if (payload.data?.status === "BOARD") {
          setStatus("ready");
          setBoard(payload.data);
        }
        if (payload.data?.status === "OVER") {
          setStatus("over");
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
    setStatus("no-session");
    setBoard(undefined);
    setWinner(undefined);
  }

  return { session, status, board, winner, sendAction, restartSession };
};

export { useGame };
