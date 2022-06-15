import React from "react";
import "./points.css";

function Points(props) {

    return (
        <div className="points">
            <i className={"fa-solid fa-clock "}></i><span> Número total de pontos: </span><span>{props.playerScore}</span>
        </div>
    )
}

export default Points;