import React from "react";
import "./control-panel.css";

function ControlPanel(props) {
  return (
    <div id="control-panel">
      <form className="form">
        <fieldset className="form-group">
          <label htmlFor="btLevel">Dificuldade: </label>
          <select
            id="btLevel"
            defaultValue="0"
            onChange={props.onLevelChange}
            disabled={props.gameStarted}
          >
            <option value="0">Selecione uma dificuldade...</option>
            <option value="1">Simples (8x8) - 5 palavras</option>
            <option value="2">Intermédio (10x10) - 8 palavras</option>
            <option value="3">Avançado (12x12) - 12 palavras</option>
          </select>
        </fieldset>
      </form>
      <button
          type="button"
          id="startBtn"
          disabled={props.selectedLevel === "0"}
          onClick={props.onGameStart}
      >{props.gameStarted ? "Parar o jogo" : "Começar o jogo!"}</button>
    </div>
  );
}

export default ControlPanel;
