import React from "react";
import "./words.css";
import { PALAVRAS } from "../../constants";

function Words(props) {
    return (
        <div className="words">
            <ul className="words-list">
                {PALAVRAS.map((word, index) => {
                    return (
                        <li key={index} className="word" style={{color: generateRandomColor()}}>
                            {word}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

function generateRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

export default Words;