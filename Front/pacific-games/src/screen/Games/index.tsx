import "./style.css";

import nimSvg from "../../assets/nim.svg";
import ticTacToeSvg from "../../assets/tictactoe.svg";

const Games = function () {
  return (
    <div className="Games">
      <h2>Jogos</h2>

      <div className="GamesList">
        <a href="/tictactoe" className="card" id="tictactoe">
          <img src={ticTacToeSvg} alt="Jogo da velha" />
          <p>JOGO DA VELHA</p>
        </a>

        <a href="/nim" className="card" id="nim">
          <img src={nimSvg} alt="Nim" />
          <p>NIM</p>
        </a>
      </div>
    </div>
  );
};

export default Games;
