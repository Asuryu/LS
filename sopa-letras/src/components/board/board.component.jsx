import React from "react";
import Letter from "../letter/letter.component";
import "./board.css";

function Board(props) {

    var gridClass;
    var board = props.board;
    switch(props.selectedLevel){
        case "1":
            gridClass = "grid-8x8";
            break;
        case "2":
            gridClass = "grid-10x10";
            break;
        case "3":
            gridClass = "grid-12x12";
            break;
        default:
            gridClass = "";
            board = [];
            break;
    }

    return (
        <div className={"board " + gridClass}>
            {board.map((row, rowIndex) => {
                return row.map((letter, colIndex) => {
                    return <Letter key={rowIndex + "-" + colIndex} letter={letter} />
                })
            })}
        </div>
    )
}

export default Board;