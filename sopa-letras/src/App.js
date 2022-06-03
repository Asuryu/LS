import { useEffect, useState } from "react";

import { TIMEOUTGAME } from "./constants";

import "./App.css"

import Board from './components/board/board.component';
import Words from './components/words/words.component';
import Timer from './components/timer/timer.component';
import ControlPanel from './components/control-panel/control-panel.component';

var timerId = null;

function App() {

  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("0");
  const [letters, setLetters] = useState([]);
  const [timer, setTimer] = useState(TIMEOUTGAME);

  const handleLevelChange = (event) => {
    const {value} = event.currentTarget;
    setSelectedLevel(value);

    var tabDim;
    var tabLetters = [];
    switch (value) {
      case "1":
        tabDim = 10;
        break;
      case "2":
        tabDim = 15;
        break;
      case "3":
        tabDim = 20;
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameStarted) {
      let nextTimer;
      timerId = setInterval(() => {
        setTimer((previousState) => {
          nextTimer = previousState - 1;
          return nextTimer;
        });
        if(nextTimer === 0){
          setGameStarted(false);
        }
      }, 1000);
    } else if(timer !== TIMEOUTGAME){
      setTimer(TIMEOUTGAME);
    }
    return () => {
      if(timerId){
        clearInterval(timerId);
      }
    }
  }, [gameStarted]);

  return (
    <div>
      <div id="background"></div>
      <div id="container">
        <Timer timer={timer}></Timer>
        <ControlPanel></ControlPanel>
        <Board></Board>
        <Words></Words>
      </div>
    </div>
  );
}

export default App;
