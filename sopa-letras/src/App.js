import { useEffect, useState } from "react";

import { TIMEOUTGAME, PALAVRAS, EXTRA_WORDS, COLOR_PALETTE } from "./constants";

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

  // Variáveis de estado (state)
  const [gameStarted, setGameStarted] = useState(false); // indica se o jogo foi iniciado
  const [selectedLevel, setSelectedLevel] = useState("0"); // indica a dificuldade selecionada
  const [words, setWords] = useState([]) // palavras do jogo
  const [timer, setTimer] = useState(TIMEOUTGAME); // tempo do jogo
  const [board, setBoard] = useState([]); // tabuleiro do jogo
  const [extraWords, setExtraWords] = useState([]); // palavras extras do jogo
  const [collectedLetters, setCollectedLetters] = useState([]); // array de letras coletadas
  const [totalCollectedLetters, setTotalCollectedLetters] = useState([]); // array de todas as letras coletadas
  const [foundWords, setFoundWords] = useState(0); // array de palavras encontradas
  const [playerName, setPlayerName] = useState("Estranho"); // nome do jogador
  const [playerScore, setPlayerScore] = useState(0); // pontuação do jogador
  const [playersBoard, setPlayersBoard] = useState([]); // scoreboard do jogo

  // Ao arrastar a primeira letra
  const handleDragStart = (event) => {
    if(gameStarted){
      if(event.target.className === "piece"){
        event.target.className = "piece letterWrap selected";
        collectedLetters.push(event.target); // adiciona a letra ao array de letras coletadas
      }
    } else {
      event.preventDefault(); 
      return false;
    }
    
  }
  // Ao arrastar o rato por cima das letras
  const handleDragEnter = (event) => {
    if(gameStarted){
      // se a letra não estiver no array de letras coletadas e for uma letra
      if(!collectedLetters.includes(event.target) && event.target.className === "piece letterWrap"){
        event.target.className = "piece letterWrap selected"; 
        collectedLetters.push(event.target); // adiciona a letra ao array de letras coletadas
      }
    } else {
      event.preventDefault();
      return false;
    }
  }
  // Quando o utilizador acabar de arrastar
  const handleDragEnd = (event) => {
    if(gameStarted){ // se o jogo estiver iniciado
      // se tiver sido selecionada mais do que uma letra
      if(collectedLetters.length > 1){
        var completeWord = collectedLetters.map(letter => letter.innerText).join(""); // junta as letras selecionadas numa string
        var wordFound = undefined; // indica se a palavra foi encontrada
        words.forEach(word => { // procura a palavra no array de palavras do jogo
          if(word.word.toLowerCase() === completeWord.toLowerCase()){ // se a palavra for encontrada
            word.found = true; // indica que a palavra foi encontrada
            wordFound = word; // guarda a palavra encontrada
          }
        });
        if (wordFound){ // se a palavra foi encontrada
          collectedLetters.forEach(element => { // para cada letra 
            element.className = "piece letterWrap";  // reseta o estilo da letra
            element.style.backgroundColor = COLOR_PALETTE[wordFound.index]; // coloca a cor da palavra na letra
          });
            let points = Math.round((100 / wordFound.word.length) + timer * 1.85); // calcula os pontos a ganhar
            setPlayerScore(playerScore + points); // aumenta a pontuação do jogador
        } else { // se a palavra não foi encontrada
          collectedLetters.forEach(element => { // para cada letra
            element.className = "piece letterWrap"; // reseta o estilo da letra
          });
          let losepoints = Math.round(completeWord.length / 1.5) * 25; // calcula os pontos a perder
          if((playerScore - losepoints) >= 0){ // se a pontuação depois de perder pontos for igual ou superior a 0
            setPlayerScore(playerScore - losepoints); // reduz a pontuação do jogador
          }
          else{ // se a pontuação depois de perder pontos for inferior a 0
            setPlayerScore(0); // reduz a pontuação do jogador para 0
          }
        }
      } else { // se tiver sido selecionada apenas uma letra
        collectedLetters.forEach(element => {
          element.className = "piece letterWrap"; // reseta o estilo da letra
          element.style.cssText = ""; // reseta o estilo da letra
        });
      }
      setFoundWords(foundWords + (wordFound ? 1 : 0)); // aumenta o número de palavras encontradas
      totalCollectedLetters.push(...collectedLetters); // adiciona as letras coletadas ao array de todas as letras coletadas
      setCollectedLetters([]); // reseta o array de letras coletadas
    } else { // se o jogo não foi iniciado
      event.preventDefault();
      return false;
    }
  }
  
  // Ao clicar no botão para começar o jogo
  const handleGameStart = () => {
    if (gameStarted) { // se o jogo estava a decorrer
      setFoundWords(0); // reseta o número de palavras encontradas
      setCollectedLetters([]); // reseta o array de letras coletadas
      setBoard(generateBoard(tabDim)); // gera um novo tabuleiro
      setGameStarted(false); // para o jogo
      words.splice(numWords, words.length); // remove as palavras extra do jogo
      setExtraWords([]); // reseta as palavras extra do jogo
    } else { // se o jogo não estava a decorrer
      setPlayerScore(0); // reseta a pontuação do jogador
      const wordsObjects = generateWords(numWords); // gera as palavras do jogo
      wordsObjects.push(...extraWords); // adiciona as palavras extras ao jogo
      setWords(wordsObjects); // adiciona as palavras ao jogo
      words.push(...extraWords); // adiciona as palavras extras ao jogo
      placeWordsOnBoard(wordsObjects); // coloca as palavras no tabuleiro
      fillWithRandomLetters(board, tabDim); // preenche o tabuleiro com letras aleatórias
      setGameStarted(true); // inicia o jogo
    }
  };

  // Ao clicar no botão para adicionar uma palavra extra
  const addWord = (event) => {
    var inputValue = document.getElementById("inputWord").value.toLowerCase(); // obtém o valor do input
    // se puder adicionar palavras e a palavra não for demasiado grande e se a palavra não estiver no jogo
    if(extraWords.length < EXTRA_WORDS && inputValue.length <= tabDim - 3 && !words.some(word => word.word === inputValue) && inputValue.length > 0) {
      var newWords = [...extraWords];
      var obj = { // cria um objeto para a palavra extra
        key: `${inputValue}-${words.length}`,
        index: words.length,
        word: inputValue,
        x: undefined,
        y: undefined,
        direction: undefined,
        found: false
      }
      newWords.push(obj);
      setWords([...words, obj]); // adiciona a palavra extra ao jogo
      setExtraWords(newWords); // adiciona a palavra extra ao array de palavras extras
      document.getElementById("inputWord").value = ""; // reseta o valor do input
    }
  }

  // Ao alterar a dificuldade do jogo
  const handleLevelChange = (event) => {
    const {value} = event.currentTarget; // obtém o valor do select
    setSelectedLevel(value); // altera o nível do jogo

    switch (value) {
      case "1": // se for o nível 1
        tabDim = 10; // tabuleiro 10x10
        numWords = 4; // 4 palavras
        timeModifier = 0; // modificador de tempo extra: 0
        break;
      case "2": // se for o nível 2
        tabDim = 12; // tabuleiro 12x12
        numWords = 7; // 7 palavras
        timeModifier = 50; // modificador de tempo extra: 50
        break;
      case "3": // se for o nível 3
        tabDim = 15; // tabuleiro 15x15
        numWords = 10; // 10 palavras
        timeModifier = 120; // modificador de tempo extra: 120
        break;
      default: // caso contrário
        tabDim = 0;
        numWords = 0;
        timeModifier = 0;
        break;
    }

    const wordsObjects = generateWords(numWords); // gera as palavras do jogo
    setWords(wordsObjects); // adiciona as palavras ao jogo
    setTimer(TIMEOUTGAME + timeModifier); // altera o tempo do jogo
    setBoard(generateBoard(tabDim)); // gera um novo tabuleiro
    setExtraWords([]); // reseta as palavras extra do jogo
    setFoundWords(0); // reseta o número de palavras encontradas
  };

  // Ao alterar o nome do jogador
  const handleNameChange = (event) => {
    var inputValue = document.getElementById("inputName").value; // obtém o valor do input
    // se o tamanho do nome estiver entre 0 e 13
    if(inputValue.length > 0 && inputValue.length <= 13){
      setPlayerName(inputValue); // altera o nome do jogador
      document.getElementById("inputName").value = ""; // reseta o valor do input
    }
  }

  // sempre que a variável foundWords é alterada este useEffect é executado (verificação de vitória)
  useEffect(() => {
    // se o número de palavras encontradas for igual ao número de palavras do jogo (ganhou)
    if(foundWords === words.length && gameStarted){
      setFoundWords(0); // reseta o número de palavras encontradas
      setCollectedLetters([]); // reseta o array de letras coletadas
      setBoard(generateBoard(tabDim)); // gera um novo tabuleiro
      setGameStarted(false); // para o jogo
      words.splice(numWords, words.length); // remove as palavras extra do jogo
      setExtraWords([]); // reseta as palavras extra do jogo
      playersBoard.push({ // adiciona o jogador à scoreboard
        name: playerName,
        score: playerScore
      });
    }
  }, [foundWords]);

  // sempre que a variável gameStarted é alterada este useEffect é executado (timer)
  useEffect(() => {
    if (gameStarted) { // se o jogo está a decorrer
      let nextTimer;
      timerId = setInterval(() => {
        setTimer((previousState) => {
          nextTimer = previousState - 1;
          return nextTimer;
        }); // decrementa o timer
        // se o timer chegar a 0 (perdeu)
        if(nextTimer === 0){
          setFoundWords(0); // reseta o número de palavras encontradas
          setCollectedLetters([]); // reseta o array de letras coletadas
          setBoard(generateBoard(tabDim)); // gera um novo tabuleiro
          setGameStarted(false); // para o jogo
          words.splice(numWords, words.length); // remove as palavras extra do jogo
          setExtraWords([]); // reseta as palavras extra do jogo
        }
      }, 1000);
    } else if(timer !== TIMEOUTGAME){ // reseta o timer se o jogo não estiver a decorrer
      setTimer(TIMEOUTGAME + timeModifier);
    }
    return () => { 
      // quando o jogo não estiver a decorrer
      if(timerId){
        clearInterval(timerId); // limpa o timer
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
          playerName={playerName}
          playerScore={playerScore}
          onChangeName={handleNameChange}
          playersBoard={playersBoard}
        />
        <Board
          selectedLevel={selectedLevel}
          board={board}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
          handleDragEnd={handleDragEnd}
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

  // função que coloca as palavras no tabuleiro
  function placeWordsOnBoard(words){

    // para cada palavra no array de palavras
    words.forEach((word, index) => {
      do { // enquanto não conseguir colocar a palavra no tabuleiro
        var currentWord = word.word; // obtém a palavra
        var wordLength = currentWord.length; // obtém o tamanho da palavra
        var randomX = Math.floor(Math.random() * tabDim); // gera um número aleatório entre 0 e o tamanho do tabuleiro
        var randomY = Math.floor(Math.random() * tabDim); // gera um número aleatório entre 0 e o tamanho do tabuleiro
        var randomDirection = Math.floor(Math.random() * 8); // gera um número aleatório entre 0 e 7 (direção da palavra)
        //console.log("Try to place word: " + currentWord + " at position: " + randomX + "," + randomY + " in direction: " + randomDirection);
      } while (!placeWord(currentWord, wordLength, randomX, randomY, randomDirection)); 
      //console.info("Word placed: " + currentWord + " at position: " + randomX + "," + randomY + " in direction: " + randomDirection);
      word.x = randomX; // preenche o objeto dessa palavra com informação (posição x)
      word.y = randomY; // preenche o objeto dessa palavra com informação (posição y)
      word.direction = randomDirection; // preenche o objeto dessa palavra com informação (direção)
    });
  }
  
  // função que coloca uma palavra no tabuleiro
  function placeWord(word, wordLength, xPosition, yPosition, direction){
    var i = 0, j = 0;
    var currentBoard = board;
    word = word.toUpperCase();
    switch (direction) {
      case 0: // West to East
        if(yPosition + wordLength <= board.length){ // se a palavra não ultrapassar o tamanho do tabuleiro
          for(i = 0; i < wordLength; i++){ // para cada letra da palavra
            if(currentBoard[xPosition][yPosition + i] === "" || currentBoard[xPosition][yPosition + i] === word[i]){ // se a letra do tabuleiro for vazia ou se a letra do tabuleiro for igual à letra da palavra
              currentBoard[xPosition][yPosition + i] = word[i]; // coloca a letra na posição do tabuleiro
            } else { // se a letra do tabuleiro não for vazia ou se a letra do tabuleiro não for igual à letra da palavra
              for(j = 0; j < i; j++){ // para cada letra da palavra
                currentBoard[xPosition][yPosition + j] = ""; // reverte as alterações feitas
              }
              setBoard(currentBoard); // atualiza o tabuleiro
              return false; // retorna falso se não conseguir colocar a palavra no tabuleiro
            };
          }
          setBoard(currentBoard); // atualiza o tabuleiro
          return true; // retorna true se a palavra foi colocada no tabuleiro 
        } else return false; // retorna falso se a palavra ultrapassar o tamanho do tabuleiro
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

  // função para gerar um tabuleiro vazio
  function generateBoard(tabDim) {
    let tmpBoard = [];
    for (let i = 0; i < tabDim; i++) { // para cada linha do tabuleiro
      let row = []; // cria uma linha vazia
      for (let j = 0; j < tabDim; j++) { // para cada coluna do tabuleiro
        row.push("") // adiciona uma posição vazia na linha
      }
      tmpBoard.push(row); // adiciona a linha ao tabuleiro
    }
    words.forEach(word => { // para cada palavra do tabuleiro
      word.found = false; // define como não encontrada
    })
    totalCollectedLetters.forEach(letter => { // para cada letra coletada
      letter.style.cssText = ""; // define como não coletada (estilo)
    });
    setTotalCollectedLetters([]); // dá clear ao array de letras coletadas
    return tmpBoard; // retorna o tabuleiro
  }

  // função para gerar as palavras do tabuleiro
  function generateWords(numWords) {
    const initialWords = shuffleArray(PALAVRAS); // gera as palavras aleatórias
    const slicedInitialWords = initialWords.slice(0, numWords); // obtém as palavras aleatórias dependendo do número de palavras desejadas
    const wordsObjects = [];
    slicedInitialWords.forEach((word, index) => { // para cada palavra aleatória
      wordsObjects.push({ // adiciona um objeto com as informações da palavra
        key: `${word}-${index}`,
        index: index,
        word: word,
        x: undefined,
        y: undefined,
        direction: undefined,
        found: false
      });
    });
    shuffleArray(wordsObjects); // embaralha as palavras
    return wordsObjects; // retorna as palavras
  }

  // função para preencher o tabuleiro com letras à sorte
  function fillWithRandomLetters(board, tabDim) {
    let possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < tabDim; i++) { // para cada linha do tabuleiro
      for (let j = 0; j < tabDim; j++) { // para cada coluna do tabuleiro
        if (board[i][j] === "") { // se a posição estiver vazia
          board[i][j] = possibleLetters[Math.floor(Math.random() * possibleLetters.length)]; // preenche com uma letra aleatória
        }
      }
    }
    return board; // retorna o tabuleiro
  }

}

export default App;
