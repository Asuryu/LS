import React from "react";
import "./letter.css";

function Letter(props) {
    return (
        <div className="piece">
            <h1 className="letter">{props.letter}</h1>
        </div>
    )
}

export default Letter;