import "./style.css";

import { useContext, type JSX } from "react";
import { GameState, useGame } from "../../hooks/useGame";
import { useNavigate } from "react-router";
import { Games } from "../../global";
import { Paths } from "../../routing/DefaultRouter";
import { PlayerContext, SessionContext } from "../../context";

const ROWS = 6;
const COLS = 7;

const ConnectFour = function () {
  const {
    status,
    board,
    winner,
    sendAction: { current: sendAction },
    restartSession,
    abandonSession,
  } = useGame(Games.CONNECT_FOUR);
  const [player] = useContext(PlayerContext);
  const [session] = useContext(SessionContext);
  const navigate = useNavigate();

  const isMyTurn = session.nextPlayer?.id === player?.id;

  function getOtherPlayer(): string | undefined {
    return session.players?.find(({ id }: { id: string }) => id !== player?.id)
      ?.name;
  }

  function getNextPlayer(): string | undefined {
    return session.nextPlayer?.name;
  }

  function getWinner(): JSX.Element {
    if (winner === "ABANDONED") {
      return <p>O adversário desistiu.</p>;
    }
    if (winner === "TIE") {
      return <p>Empate!</p>;
    }
    if (winner) {
      const winnerPlayer = session.players?.find(
        ({ id }: { id: string }) => id === winner,
      );
      return <p>O vencedor é {winnerPlayer?.name}</p>;
    }
    return <></>;
  }

  function handleColumnClick(col: number) {
    if (!isMyTurn) return;
    sendAction({
      action: "place",
      parameter: String(col),
      session: session,
      player: player,
    });
  }

  function handleQuit() {
    abandonSession();
    navigate(Paths.GAMES);
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
              <button onClick={handleQuit}>Desistir</button>
            </>
          )}
          <p id="session-id">ID da sessão: {session.id}</p>
        </div>
      </div>
    );
  }

  function renderBoard(): JSX.Element {
    const cells = board?.info?.split(",") ?? [];

    return (
      <div className="cf-container">
        {isMyTurn && (
          <div className="cf-col-buttons">
            {Array.from({ length: COLS }, (_, col) => (
              <button
                key={col}
                className="cf-drop-btn"
                onClick={() => handleColumnClick(col)}
                aria-label={`Coluna ${col + 1}`}
              >
                ▼
              </button>
            ))}
          </div>
        )}
        <div className="cf-board">
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const cell = cells[row * COLS + col] ?? "";
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cf-cell ${cell === "red" ? "cf-red" : cell === "yellow" ? "cf-yellow" : ""}`}
                />
              );
            }),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ConnectFour">
      <h2>Quatro em Linha</h2>
      <p>Você está jogando com {getOtherPlayer()}</p>
      <p>{isMyTurn ? "Sua vez!" : `É a vez de ${getNextPlayer()}`}</p>
      <main>{renderBoard()}</main>

      <button className="forfeit-btn" onClick={handleForfeit}>
        Desistir
      </button>
    </div>
  );
};

export default ConnectFour;
