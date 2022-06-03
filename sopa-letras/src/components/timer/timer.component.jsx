import React from "react";
import "./timer.css";

function Timer(props) {
    var timerClass = "";
    if(props.timer <= 10) {
        timerClass = "timer-red";
    } else if(props.timer <= 20) {
        timerClass = "timer-yellow";
    } else {
        timerClass = "";
    }

    return (
        <div className="timer">
            <i class="fa-solid fa-clock"> Tempo Restante: <span className={timerClass}>{props.timer}</span></i>
        </div>
    )
}

export default Timer;