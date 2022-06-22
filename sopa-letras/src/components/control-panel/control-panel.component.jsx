import React from "react";
import { EXTRA_WORDS } from "../../constants";
import "./control-panel.css";

function ControlPanel(props) {
  var scoreboard = props.playersBoard; // scoreboard = tabela de pontuação
  scoreboard.sort((a, b) => { // ordena a tabela de pontuação
    return b.score - a.score; // de forma decrescente
  });
  scoreboard = scoreboard.slice(0, 3); // obtém os 3 primeiros jogadores (top 3)

  return (
    <div id="control-panel">

      <div id="scoreboard"> {/* tabela de pontuação */}
        <h1>Scoreboard</h1>
          {
            scoreboard.map((player, index) => { // para cada jogador na scoreboard
              return ( // mostra o nome e o score do jogador
                <div className="score" id={"score-" + (index + 1)}><h1>{(index + 1) + ". " + player.name + " (" + player.score + ")"}</h1></div>
              );
            })
          }
      </div>

      <div id="controls"> {/* seleção da dificuldade */}
        <form className="form">
          <fieldset className="form-group">
            <label htmlFor="btLevel">Dificuldade</label>
            <select
              id="btLevel"
              defaultValue="0"
              onChange={props.onLevelChange}
              disabled={props.gameStarted}
            >
              <option value="0">Selecione uma dificuldade...</option>
              <option value="1">Simples (10x10) - 4 palavras</option>
              <option value="2">Intermédio (12x12) - 7 palavras</option>
              <option value="3">Avançado (15x15) - 10 palavras</option>
            </select>
          </fieldset>
        </form>
      </div>
        
        <div className="extraWords"> {/* palavras extras */}
        <input id = "inputWord" placeholder="Introduza uma palavra" disabled={props.gameStarted || props.selectedLevel === "0"}></input>
        <button 
        type="button"
        id= "writeBtn"
        disabled={props.gameStarted || props.selectedLevel === "0"} 
        onClick={props.onAddWord}
        >Adicionar Palavra</button>
        <h1>Palavras Extra</h1>
        <h2>{Math.abs(EXTRA_WORDS - props.extraWords.length) + " restante(s)"}</h2>
      </div>

      <div id="playerName"> {/* escolha do nome do jogador */}
        <h1>{props.playerName ? props.playerName : "Olá, Estranho"}</h1>
        <input id = "inputName" placeholder="Introduza um nome" disabled={props.gameStarted}></input>
        <button 
        type="button"
        id= "setNameBtn"
        disabled={props.gameStarted} 
        onClick={props.onChangeName}
        >Definir Nome</button>
      </div>

      <div id="currentScore" style={{display: props.gameStarted ? "block" : "none" }}> {/* pontuação atual */}
        <h1>Pontuação Atual</h1>
        <div><i className={"fa-solid fa-star"}></i> <span>{props.playerScore}</span></div>
      </div>

      <div id="btnWrap"> {/* botões de iniciar e parar o jogo */}
        <button
            type="button"
            id={props.gameStarted ? "stopBtn" : "startBtn"}
            disabled={props.selectedLevel === "0"}
            onClick={props.onGameStart}
        >{props.gameStarted ? "Parar o jogo" : "Começar o jogo!"}</button>
      </div>

    </div>
  );
}

export default ControlPanel;
