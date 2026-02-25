import "./style.css";

import { useMemo, type JSX } from "react";
import useGame from "../../hooks/useGame";
import { useNavigate } from "react-router";

const TicTacToe = function () {
  const {
    status,
    session,
    board,
    winner,
    sendAction: { current: sendAction },
    restartSession,
  } = useGame("tictactoe");
  const player = useMemo(() => {
    const playerInfo = sessionStorage.getItem("Player-Info");
    return JSON.parse(playerInfo ?? "{}");
  }, []);
  const navigate = useNavigate();

  function getOtherPlayer(): string {
    return session.players?.find(({ id }: { id: string }) => id !== player.id)
      ?.name;
  }

  function getNextPlayer(): string {
    return session.nextPlayer?.name;
  }

  function getWinner(): JSX.Element {
    if (winner == "TIE") {
      return <p>Empate!</p>;
    }
    if (winner) {
      const winnerPlayer = session.players?.find(({ id }: { id: string }) => {
        return id === winner;
      });
      return <p>O vencedor é {winnerPlayer?.name}</p>;
    }
    return <></>;
  }

  const handleCellClick: React.MouseEventHandler<HTMLButtonElement> = function (
    event,
  ) {
    const button = event.target as HTMLButtonElement;
    sendAction({
      action: "place",
      parameter: button.id,
      session: session,
      player: player,
    });
  };

  if (status != "ready") {
    return (
      <div className="modal">
        <div className="modal-content">
          {status === "over" ? (
            <>
              {getWinner()}
              <button onClick={() => navigate("/games")}>Voltar</button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("Session-Info");
                  restartSession();
                }}
              >
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
              <button
                onClick={() => {
                  sessionStorage.removeItem("Session-Info");
                  navigate("/games");
                }}
              >
                Desistir
              </button>
            </>
          )}
          <p id="session-id">ID da sessão: {session.id}</p>
        </div>
      </div>
    );
  }

  function renderCells(): JSX.Element[] | undefined {
    const cells = board?.info.split(",");
    return cells?.map((cell, index) => {
      const key = index.toString(3).padStart(2, "0");
      return (
        <button onClick={handleCellClick} className="cell" id={key} key={key}>
          {cell.replace("cross", "\u2a09").replace("circle", "\u2b58")}
        </button>
      );
    });
  }

  return (
    <div className="TicTacToe">
      <h2>Jogo da Velha</h2>
      <p>Você está jogando com {getOtherPlayer()}</p>

      <p>É a vez de {getNextPlayer()}</p>

      <main>
        <div className="card" id="tictactoe-board">
          {renderCells()}
        </div>
      </main>
    </div>
  );
};

export default TicTacToe;
