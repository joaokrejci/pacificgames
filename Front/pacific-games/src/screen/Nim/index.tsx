import "./style.css";

import { useContext, type JSX } from "react";
import { GameState, useGame } from "../../hooks/useGame";
import { useNavigate } from "react-router";
import { Games } from "../../global";
import { Paths } from "../../routing/DefaultRouter";
import { PlayerContext, SessionContext } from "../../context";

const Nim = function () {
  const {
    status,
    board,
    winner,
    sendAction: { current: sendAction },
    restartSession,
    abandonSession,
  } = useGame(Games.NIM);
  const [player] = useContext(PlayerContext);
  const [session] = useContext(SessionContext);
  const navigate = useNavigate();

  function getOtherPlayer(): string | undefined {
    return session.players?.find(({ id }: { id: string }) => id !== player?.id)
      ?.name;
  }

  function getNextPlayer(): string | undefined {
    return session.nextPlayer?.name;
  }

  function isMyTurn(): boolean {
    return session.nextPlayer?.id === player?.id;
  }

  function getWinner(): JSX.Element {
    if (winner === "ABANDONED") {
      return <p>O adversário desistiu.</p>;
    }
    if (winner) {
      const winnerPlayer = session.players?.find(
        ({ id }: { id: string }) => id === winner
      );
      return <p>O vencedor é {winnerPlayer?.name ?? winner}</p>;
    }
    return <></>;
  }

  function getPebbleCount(): number {
    return parseInt(board?.info ?? "0", 10);
  }

  function handleTake(amount: number) {
    sendAction({
      action: "take",
      parameter: amount.toString(),
      session: session,
      player: player,
    });
  }

  function handleForfeit() {
    abandonSession();
    navigate(Paths.GAMES);
  }

  if (status !== GameState.READY) {
    return (
      <div className="modal">
        <div className="modal-content">
          {status === GameState.OVER ? (
            <>
              {getWinner()}
              <button onClick={() => { abandonSession(); navigate(Paths.GAMES); }}>Voltar</button>
              <button onClick={() => restartSession()}>
                Procurar outra partida
              </button>
            </>
          ) : (
            <>
              <p className="waiting-text">
                <span id="waiting-players-text">
                  Aguardando outros jogadores
                </span>
                <span className="spinner">&times;</span>
              </p>
              <button onClick={() => { abandonSession(); navigate(Paths.GAMES); }}>Desistir</button>
            </>
          )}
          <p id="session-id">ID da sessão: {session.id}</p>
        </div>
      </div>
    );
  }

  function renderPebbles(): JSX.Element[] {
    const total = 23;
    const remaining = getPebbleCount();
    const pebbles: JSX.Element[] = [];

    for (let i = 0; i < total; i++) {
      const isRemoved = i >= remaining;
      pebbles.push(
        <div
          key={i}
          className={`pebble ${isRemoved ? "removed" : ""}`}
        />
      );
    }
    return pebbles;
  }

  const pebbleCount = getPebbleCount();

  return (
    <div className="Nim">
      <h2>Nim</h2>
      <p>Você está jogando com {getOtherPlayer()}</p>
      <p>É a vez de {getNextPlayer()}</p>

      <div className="pebbles-container">{renderPebbles()}</div>

      <p className="pebble-count">
        Pedras restantes: {pebbleCount}
      </p>

      <div className="take-buttons">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            disabled={!isMyTurn() || n > pebbleCount}
            onClick={() => handleTake(n)}
          >
            Tirar {n}
          </button>
        ))}
      </div>

      <button className="forfeit-btn" onClick={handleForfeit}>
        Desistir
      </button>
    </div>
  );
};

export default Nim;
