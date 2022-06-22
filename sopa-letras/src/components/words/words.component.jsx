import React from "react";
import "./words.css";
import { COLOR_PALETTE } from "../../constants";

function Words(props) {
    
    return (
        <div className="words">
            <ul className="words-list">
                {props.words.map(word => { // para cada palavra da lista de palavras
                    if(word.found === false){ // se a palavra não foi encontrada
                        return ( 
                            <li key={word.key} className="word" color={COLOR_PALETTE[word.index]} style={{color: COLOR_PALETTE[word.index]}}>
                                {word.word}
                            </li>
                        )
                    } else { // se a palavra foi encontrada
                        return ( // marca a palavra como encontrada na lista (estilo)
                            <li key={word.key} className="word" color={COLOR_PALETTE[word.index]} style={{textDecoration: "line-through 3px " + COLOR_PALETTE[word.index], color: COLOR_PALETTE[word.index]}}>
                                <s>{word.word}</s>
                            </li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}

export default Words;