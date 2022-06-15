import React from "react";
import { EXTRA_WORDS } from "../../constants";
import "./control-panel.css";

function ControlPanel(props) {
  return (
    <div id="control-panel">

      <div id="scoreboard">
        <h1>Scoreboard</h1>
       {props.playersBoard.map((player, index) => {
          return (
            <div className="score" id={"score-" + (index + 1)}><h1>{(index + 1) + ". " + player}</h1></div>
          );
        }
      )}
      </div>
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
      <button
          type="button"
          id={props.gameStarted ? "stopBtn" : "startBtn"}
          disabled={props.selectedLevel === "0"}
          onClick={props.onGameStart}
      >{props.gameStarted ? "Parar o jogo" : "Começar o jogo!"}</button>
        
        <div className="extraWords">
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

      <div id="playerName">
        <h1>{props.playerName ? props.playerName : "Olá, estranho"}</h1>
        <input id = "inputName" placeholder="Introduza um nome" disabled={props.gameStarted}></input>
        <button 
        type="button"
        id= "setNameBtn"
        disabled={props.gameStarted} 
        onClick={props.onChangeName}
        >Definir Nome</button>
      </div>

    </div>
  );
}

export default ControlPanel;
