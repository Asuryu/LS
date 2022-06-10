import React from "react";
import "./letter.css";

function Letter(props) {

    return (
        <div draggable="true" 
            onDragStart={props.handleDragStart}
            onDragEnter={props.handleDragEnter} 
            onDragEnd={props.handleDragEnd}
            className="piece letterWrap">
            <h1 draggable="false" className="letter">{props.letter}</h1>
        </div>
    )
}


export default Letter;