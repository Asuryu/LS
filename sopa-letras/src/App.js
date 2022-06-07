import { useEffect, useState } from "react";

import { TIMEOUTGAME, PALAVRAS } from "./constants";

import "./App.css"

import Board from './components/board/board.component';
import Words from './components/words/words.component';
import Timer from './components/timer/timer.component';
import ControlPanel from './components/control-panel/control-panel.component';
import shuffleArray from "./helpers/shuffleArray";

var timerId = null;
var tabDim = 0;

function App() {

  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("0");
  const [words, setWords] = useState([])
  const [timer, setTimer] = useState(TIMEOUTGAME);
  const [board, setBoard] = useState([]);
  // const [collectedLetters, setCollectedLetters] = useState([]);

  const handleGameStart = () => {
    if (gameStarted) {
      console.log("Termina Jogo");
      setGameStarted(false);
    } else {
      console.log("Inicia Jogo");
      var generatedBoard = generateBoard(tabDim);
      setBoard(generatedBoard);
      placeWordsOnBoard(words);
      setGameStarted(true);
    }
  };

  const handleLevelChange = (event) => {
    const {value} = event.currentTarget;
    setSelectedLevel(value);

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
    var generatedBoard = generateBoard(tabDim);
    setBoard(generatedBoard);
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
          selectedLevel={selectedLevel}
          board={board}
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

  function placeWordsOnBoard(words){

    words.forEach((word, index) => {
      do {
        var currentWord = word.word;
        var wordLength = currentWord.length;
        var randomX = Math.floor(Math.random() * tabDim);
        var randomY = Math.floor(Math.random() * tabDim);
        var randomDirection = Math.floor(Math.random() * 8);
      } while (!placeWord(currentWord, wordLength, randomX, randomY, randomDirection));
    });
  }
  
  function placeWord(word, wordLength, xPosition, yPosition, direction){
    var i = 0;
    var currentBoard = board;
    word = word.toUpperCase();
    switch (direction) {
      case 0: // North to South
        if(xPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition + i][yPosition] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 1: // East to West
        if(yPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition][yPosition + i] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 2: // South to North
        if(xPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition - i][yPosition] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 3: // West to East
        if(yPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition][yPosition - i] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 4: // North-East to South-West
        if(xPosition + wordLength <= board.length && yPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition + i][yPosition - i] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 5: // North-West to South-East
        if(xPosition - wordLength >= 0 && yPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition - i][yPosition + i] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 6: // South-East to North-West
        if(xPosition - wordLength >= 0 && yPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition - i][yPosition - i] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 7: // South-West to North-East
        if(xPosition + wordLength <= board.length && yPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            currentBoard[xPosition + i][yPosition + i] = word[i];
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      default:
        return false;
    }
  }

  function generateBoard(tabDim) {
    let board = [];
    let possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < tabDim; i++) {
      let row = [];
      for (let j = 0; j < tabDim; j++) {
        row.push(possibleLetters[Math.floor(Math.random() * possibleLetters.length)]);
      }
      board.push(row);
    }
    return board;
  }

}

export default App;
