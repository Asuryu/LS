import { useEffect, useState } from "react";

import { TIMEOUTGAME, PALAVRAS, EXTRA_WORDS } from "./constants";

import "./App.css"

import Board from './components/board/board.component';
import Words from './components/words/words.component';
import Timer from './components/timer/timer.component';
import ControlPanel from './components/control-panel/control-panel.component';
import shuffleArray from "./helpers/shuffleArray";

var timerId = null;
var tabDim = 0;
var numWords = 0;
var timeModifier = 0;

function App() {

  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("0");
  const [words, setWords] = useState([])
  const [timer, setTimer] = useState(TIMEOUTGAME);
  const [board, setBoard] = useState([]);
  const [extraWords, setExtraWords] = useState([]);
  // const [collectedLetters, setCollectedLetters] = useState([]);

  const handleGameStart = () => {
    if (gameStarted) {
      setBoard(generateBoard(tabDim));
      setGameStarted(false);
      words.splice(numWords, words.length);
      setExtraWords([]);
    } else {
      const wordsObjects = generateWords(numWords);
      wordsObjects.push(...extraWords);
      setWords(wordsObjects);
      words.push(...extraWords);
      placeWordsOnBoard(words);
      console.log(wordsObjects);
      // fillWithRandomLetters(board, tabDim);
      setGameStarted(true);
    }
  };

  const addWord = (event) => {
    var inputValue = document.getElementById("inputWord").value.toLowerCase();
    if(extraWords.length < EXTRA_WORDS && inputValue.length <= tabDim - 3 && !words.some(word => word.word === inputValue) && inputValue.length > 0) {
      var newWords = [...extraWords];
      var obj = {
        key: `${inputValue}-${extraWords.length}`,
        index: extraWords.length,
        word: inputValue,
      }
      newWords.push(obj);
      // add extra words to words list
      setWords([...words, obj]);
      setExtraWords(newWords);
      document.getElementById("inputWord").value = "";
    }
  }

  const handleLevelChange = (event) => {
    const {value} = event.currentTarget;
    setSelectedLevel(value);

    switch (value) {
      case "1":
        tabDim = 10;
        numWords = 4;
        timeModifier = 0;
        break;
      case "2":
        tabDim = 12;
        numWords = 7;
        timeModifier = 30;
        break;
      case "3":
        tabDim = 15;
        numWords = 10;
        timeModifier = 50;
        break;
      default:
        tabDim = 0;
        numWords = 0;
        timeModifier = 0;
        break;
    }

    const wordsObjects = generateWords(numWords);
    setWords(wordsObjects);
    setTimer(TIMEOUTGAME + timeModifier);
    setBoard(generateBoard(tabDim));
    setExtraWords([]);
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
          setBoard(generateBoard(tabDim));
          setGameStarted(false);
          words.splice(numWords, words.length);
          setExtraWords([]);
        }
      }, 1000);
    } else if(timer !== TIMEOUTGAME){
      setTimer(TIMEOUTGAME + timeModifier);
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
          extraWords={extraWords}
          onAddWord={addWord}
        />
        <Board
          selectedLevel={selectedLevel}
          board={board}
        />
        <Words 
          words={words} 
          gameStarted={gameStarted} 
        />
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
        //console.log("Try to place word: " + currentWord + " at position: " + randomX + "," + randomY + " in direction: " + randomDirection);
      } while (!placeWord(currentWord, wordLength, randomX, randomY, randomDirection));
      //console.info("Word placed: " + currentWord + " at position: " + randomX + "," + randomY + " in direction: " + randomDirection);
    });
  }
  
  function placeWord(word, wordLength, xPosition, yPosition, direction){
    var i = 0, j = 0;
    var currentBoard = board;
    word = word.toUpperCase();
    switch (direction) {
      case 0: // West to East
        if(yPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition][yPosition + i] === "" || currentBoard[xPosition][yPosition + i] === word[i]){
              currentBoard[xPosition][yPosition + i] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition][yPosition + j] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 1: // North to South
        if(xPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition + i][yPosition] === "" || currentBoard[xPosition + i][yPosition] === word[i]){
              currentBoard[xPosition + i][yPosition] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition + j][yPosition] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 2: // North-West to South-East
        if(xPosition + wordLength <= board.length && yPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition + i][yPosition + i] === "" || currentBoard[xPosition + i][yPosition + i] === word[i]){
              currentBoard[xPosition + i][yPosition + i] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition + j][yPosition + j] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 3: // South-West to North-East
        if(xPosition - wordLength >= 0 && yPosition + wordLength <= board.length){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition - i][yPosition + i] === "" || currentBoard[xPosition - i][yPosition + i] === word[i]){
              currentBoard[xPosition - i][yPosition + i] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition - j][yPosition + j] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 4: // South to North
        if(xPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition - i][yPosition] === "" || currentBoard[xPosition - i][yPosition] === word[i]){
              currentBoard[xPosition - i][yPosition] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition - j][yPosition] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 5: // South-East to North-West
        if(xPosition - wordLength >= 0 && yPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition - i][yPosition - i] === "" || currentBoard[xPosition - i][yPosition - i] === word[i]){
              currentBoard[xPosition - i][yPosition - i] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition - j][yPosition - j] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 6: // East to West
        if(yPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition][yPosition - i] === "" || currentBoard[xPosition][yPosition - i] === word[i]){
              currentBoard[xPosition][yPosition - i] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition][yPosition - j] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      case 7: // North-East to South-West
        if(xPosition + wordLength <= board.length && yPosition - wordLength >= 0){
          for(i = 0; i < wordLength; i++){
            if(currentBoard[xPosition + i][yPosition - i] === "" || currentBoard[xPosition + i][yPosition - i] === word[i]){
              currentBoard[xPosition + i][yPosition - i] = word[i];
            } else {
              for(j = 0; j < i; j++){
                currentBoard[xPosition + j][yPosition - j] = "";
              }
              setBoard(currentBoard);
              return false;
            };
          }
          setBoard(currentBoard);
          return true;
        } else return false;
      default:
        return false;
    }
  }

  function generateBoard(tabDim) {
    let tmpBoard = [];
    for (let i = 0; i < tabDim; i++) {
      let row = [];
      for (let j = 0; j < tabDim; j++) {
        row.push("")
      }
      tmpBoard.push(row);
    }
    return tmpBoard;
  }

  function generateWords(numWords) {
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
    return wordsObjects;
  }

  function fillWithRandomLetters(board, tabDim) {
    let possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < tabDim; i++) {
      for (let j = 0; j < tabDim; j++) {
        if (board[i][j] === "") {
          board[i][j] = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
        }
      }
    }
    return board;
  }

}

export default App;
