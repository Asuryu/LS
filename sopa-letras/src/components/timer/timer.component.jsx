import React from "react";
import "./timer.css";

function Timer(props) {
    var timerClass = "";
    var timer = props.timer;

    if(timer <= 10) {
        timerClass = "timer-red";
    } else if(timer <= 20) {
        timerClass = "timer-yellow";
    } else {
        timerClass = "";
    }

    if(props.selectedLevel === "0") timer = 0;

    return (
        <div className="timer">
            <i className="fa-solid fa-clock"> Tempo Restante: <span className={timerClass}>{timer}</span></i>
        </div>
    )
}

export default Timer;