import React from "react";
import Letter from "../letter/letter.component";
import "./board.css";

function Board(props) {
    var totalLetters;
    var gridClass;
    console.log(props.selectedLevel)
    switch(props.selectedLevel){
        case "1":
            totalLetters = 8 * 8;
            gridClass = "grid-8x8";
            break;
        case "2":
            totalLetters = 10 * 10;
            gridClass = "grid-10x10";
            break;
        case "3":
            totalLetters = 12 * 12;
            gridClass = "grid-12x12";
            break;
        default:
            totalLetters = 0;
            gridClass = "";
            break;
    }

    return (
        <div className={"board " + gridClass}>
            {generateBoard(totalLetters).map((letter, index) => {
                return <Letter letter={letter} />
            })}
        </div>
    )
}

function generateBoard(size) {
    let board = [];
    let possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < size; i++) {
        board.push(possibleLetters[Math.floor(Math.random() * possibleLetters.length)]);
    }
    return board;
}



export default Board;