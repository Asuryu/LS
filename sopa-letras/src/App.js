import "./App.css"

import Board from './components/board/board.component';
import Words from './components/words/words.component';

function App() {
  return (
    <div>
      <div id="background"></div>
      <div id="container">
        <Board></Board>
        <Words></Words>
      </div>
    </div>
  );
}

export default App;
