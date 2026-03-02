import { API } from "../global";
import { PlayerContext, SessionContext } from "../context";
import { useContext, useEffect, useRef, useState } from "react";

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
    (session?.id && session?.game === gameType) ? GameState.GOT_SESSION : GameState.NO_SESSION
  );
  
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [winner, setWinner] = useState<string | undefined>(undefined);

  const requestJoinSession = useRequest({ path: API.joinSession });

  const sendAction = useRef<ActionFunction>(() => { });
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const joinPendingRef = useRef(false);
  const mountedRef = useRef(true);

  function teardown() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onmessage = null;
      wsRef.current.onopen = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    sendAction.current = () => { };
    joinPendingRef.current = false;
  }

  function sendLeave() {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          action: "abandon",
          session: session,
          player: player,
          game: gameType,
        }));
      } catch (_) {  }
    }
  }

  if (status === GameState.NO_SESSION && !joinPendingRef.current) {
    joinPendingRef.current = true;
    setStatus(GameState.GETTING_SESSION);
    requestJoinSession({
      action: "join_session",
      player: player,
      game: gameType,
    })
      .then((result) => {
        joinPendingRef.current = false;
        if (!mountedRef.current) return;
        if (result.type === "SESSION") {
          setStatus(GameState.GOT_SESSION);
          setSession({ ...result.data, game: gameType });
        }
        if (result.type === "ERROR") {
          setTimeout(() => {
            if (mountedRef.current) {
              setStatus(GameState.NO_SESSION);
            }
          }, 5000);
        }
      });
  }

  if (status === GameState.GOT_SESSION && !wsRef.current) {
    setStatus(GameState.SUBSCRIBING);
    const ws = new WebSocket(`${API.URL}${API.game}`);
    wsRef.current = ws;

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
        ws.send(JSON.stringify({ ...action, game: gameType }));
      };
    };

    const interval = setInterval(() => subscribeToSession(), 3000);
    intervalRef.current = interval;

    ws.onmessage = function (event) {
      const payload = JSON.parse(event.data);

      if (payload.type === "STATUS") {
        if (payload.data?.status === "INCOMPLETE") {
          setStatus(GameState.WAITING);
        }
        if (payload.data?.status === "BOARD") {
          clearInterval(interval);
          intervalRef.current = null;
          setStatus(GameState.READY);
          setBoard(payload.data);
        }
        if (payload.data?.status === "OVER") {
          clearInterval(interval);
          intervalRef.current = null;
          setStatus(GameState.OVER);
          setWinner(payload.data?.info);
        }
      }
      if (payload.type === "SESSION") {
        setSession({ ...payload.data, game: gameType });
      }
      if (payload.type === "ERROR") {
        const msg: string = payload.data?.message ?? "";
        const isFatal = msg !== "INVALID_ACTION" && !msg.startsWith("INVALID_ACTION");
        if (isFatal) {
          teardown();
          setSession({});
          setStatus(GameState.NO_SESSION);
        }
      }
    };
  }

  function restartSession() {
    sendLeave();
    teardown();
    setSession({});
    setStatus(GameState.NO_SESSION);
    setBoard(undefined);
    setWinner(undefined);
  }
  function abandonSession() {
    sendLeave();
    teardown();
    setSession({});
    setBoard(undefined);
    setWinner(undefined);
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      setSession({});
    };
  }, []);

  return { status, board, winner, sendAction, restartSession, abandonSession };
};

export { useGame, GameState };
