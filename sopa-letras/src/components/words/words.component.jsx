import React from "react";
import "./words.css";
import { PALAVRAS, COLOR_PALETTE } from "../../constants";

function Words(props) {
    return (
        <div className="words">
            <ul className="words-list">
                {PALAVRAS.map((word, index) => {
                    return (
                        <li key={index} className="word" style={{color: COLOR_PALETTE[index]}}>
                            {word}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Words;