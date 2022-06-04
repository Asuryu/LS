import React from "react";
import "./words.css";
import { COLOR_PALETTE } from "../../constants";

function Words(props) {
    return (
        <div className="words">
            <ul className="words-list">
                {props.words.map(word => {
                    return (
                        <li key={word.id} className="word" style={{color: COLOR_PALETTE[word.index]}}>
                            {word.name}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Words;