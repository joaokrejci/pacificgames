import "./style.css";

import { Paths } from "../../routing/DefaultRouter";
import nimSvg from "../../assets/nim.svg";
import ticTacToeSvg from "../../assets/tictactoe.svg";
import connectFourSvg from "../../assets/connectfour.svg";

const Games = function () {
  return (
    <div className="Games">
      <h2>Jogos</h2>

      <div className="GamesList">
        <a href={Paths.TICTACTOE} className="card" id="tictactoe">
          <img src={ticTacToeSvg} alt="Jogo da velha" />
          <p>JOGO DA VELHA</p>
        </a>

        <a href={Paths.NIM} className="card" id="nim">
          <img src={nimSvg} alt="Nim" />
          <p>NIM</p>
        </a>

        <a href={Paths.CONNECTFOUR} className="card" id="connectfour">
          <img src={connectFourSvg} alt="Quatro em linha" />
          <p>QUATRO EM LINHA</p>
        </a>
      </div>
    </div>
  );
};

export default Games;
