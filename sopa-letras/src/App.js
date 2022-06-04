import { useEffect, useState } from "react";

import { TIMEOUTGAME, PALAVRAS } from "./constants";

import "./App.css"

import Board from './components/board/board.component';
import Words from './components/words/words.component';
import Timer from './components/timer/timer.component';
import ControlPanel from './components/control-panel/control-panel.component';
import shuffleArray from "./helpers/shuffleArray";

var timerId = null;
var timeModifier = 0;

function App() {

  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("0");
  const [words, setWords] = useState([])
  const [timer, setTimer] = useState(TIMEOUTGAME);
  const [collectedLetters, setCollectedLetters] = useState([]);

  const handleGameStart = () => {
    if (gameStarted) {
      console.log("Termina Jogo");
      setGameStarted(false);
    } else {
      console.log("Inicia Jogo");
      setGameStarted(true);
    }
  };

  const handleLevelChange = (event) => {
    const {value} = event.currentTarget;
    setSelectedLevel(value);

    var tabDim = 0;
    var numWords = 0;
    var timeModifier = 0;
    switch (value) {
      case "1":
        tabDim = 8;
        numWords = 5;
        timeModifier = 0;
        break;
      case "2":
        tabDim = 10;
        numWords = 8;
        timeModifier = 10;
        break;
      case "3":
        tabDim = 12;
        numWords = 12;
        timeModifier = 20;
        break;
      default:
        break;
    }

    const initialWords = shuffleArray(PALAVRAS);
    const slicedInitialWords = initialWords.slice(0, numWords);
    const wordsObjects = [];
    slicedInitialWords.forEach((word, index) => {
      wordsObjects.push({
        key: `${word}-${index}`,
        index: index,
        word: word,
      });
    });
    shuffleArray(wordsObjects);
    setWords(wordsObjects);
    setTimer(TIMEOUTGAME + timeModifier);
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
      <h1 id="title">Sopinha de Letras</h1>
      <div id="background"></div>
      <div id="container">
        <ControlPanel
          gameStarted={gameStarted}
          onGameStart={handleGameStart}
          selectedLevel={selectedLevel}
          onLevelChange={handleLevelChange}
        />
        <Board
          words={words}
          selectedLevel={selectedLevel}
        />
        <Words words={words}></Words>
        <Timer 
          timer={timer}
          gameStarted={gameStarted}
          selectedLevel={selectedLevel}
        />
      </div>
    </div>
  );
}

export default App;
