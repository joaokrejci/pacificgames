import "./style.css";

import { useContext, type JSX } from "react";
import { GameState, useGame } from "../../hooks/useGame";
import { useNavigate } from "react-router";
import { Games } from "../../global";
import { Paths } from "../../routing/DefaultRouter";
import { PlayerContext, SessionContext } from "../../context";

const TicTacToe = function () {
  const {
    status,
    board,
    winner,
    sendAction: { current: sendAction },
    restartSession,
  } = useGame(Games.TIC_TAC_TOE);
  const [player] = useContext(PlayerContext)
  const [session] = useContext(SessionContext)
  const navigate = useNavigate();

  function getOtherPlayer(): string | undefined {
    return session.players?.find(({ id }: { id: string }) => id !== player?.id)
      ?.name;
  }

  function getNextPlayer(): string | undefined {
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

  if (status != GameState.READY) {
    return (
      <div className="modal">
        <div className="modal-content">
          {status === GameState.OVER ? (
            <>
              {getWinner()}
              <button onClick={() => navigate(Paths.GAMES)}>Voltar</button>
              <button
                onClick={() => {
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
                    
                  navigate(Paths.GAMES);
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
    return cells?.map((cell: string, index: number) => {
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
