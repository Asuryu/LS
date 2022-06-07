import React from "react";
import "./timer.css";

function Timer(props) {
    var timerClass = "";
    var timer = props.timer;

    if(timer <= 10) {
        timerClass = "timer-red";
    } else if(timer <= 20) {
        timerClass = "timer-yellow";
    } else if (props.gameStarted){
        timerClass = "timer-green";
    } else {
        timerClass = "";
    }

    if(props.selectedLevel === "0") timer = 0;

    return (
        <div className="timer">
            <i className={"fa-solid fa-clock " + timerClass}></i><span> Tempo Restante: </span><span className={timerClass}>{timer}</span>
        </div>
    )
}

export default Timer;