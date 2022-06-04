import React from "react";
import "./words.css";
import { COLOR_PALETTE } from "../../constants";

function Words(props) {
    console.log(props.words);
    return (
        <div className="words">
            <ul className="words-list">
                {props.words.map(word => {
                    return (
                        <li key={word.key} className="word" color={COLOR_PALETTE[word.index]} style={{color: COLOR_PALETTE[word.index]}}>
                            {word.word}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Words;