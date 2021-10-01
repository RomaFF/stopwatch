import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom';
import {interval, Observable, pipe, Subject, switchMap, takeUntil} from 'rxjs';
import style from './App.module.css';
import MyBtn from "./components/MyBtn/MyBtn";

function App() {
  const [time, setTime] = useState(0);
  const [waitS, setWaitS] = useState(0)
  const [timer, setTimer] = useState(`00:00:00`)
  const [stopwatchStatus, setStopwatchStatus] = useState("stop")

  const setTimeNow = (time) => {
    let hh = Math.floor(time / 3600),
        mm = Math.floor((time - hh * 3600) / 60),
        ss = Math.floor(time - mm * 60 - hh * 3600)

    let localS = 0, localM = 0, localH = 0
    if (+ss === 59) {
      ss = '00'
      if (+mm === 59) {
        mm = '00'
        localH = +hh + 1
        String(+localH).length < 2 ? hh = '0' + (localH) : hh = localH
      } else {
        localM = +mm + 1
        String(localM).length < 2 ? mm = '0' + (localM) : mm = localM
      }
    } else {
      localS = +ss + 1
      String(+localS).length < 2 ? ss = '0' + (localS) : ss = localS
      String(localM).length < 2 ? mm = '0' + (localM) : mm = localM
      String(+localH).length < 2 ? hh = '0' + (localH) : hh = localH
    }
    setTimer(`${hh}:${mm}:${ss}`)
  }

  useEffect(() => {
    const stay = new Subject();
    console.log(stopwatchStatus)

    interval(1000)
        .pipe(takeUntil(stay))
        .subscribe((observer) => {
          if (stopwatchStatus === "start") {
            setTime(i => i + 1)
          }
        });
    return () => {
      stay.next();
      stay.complete();
    };
  }, [stopwatchStatus]);

  useEffect(() => {
    setTimeNow(time)
  }, [time])

  useEffect(() => {
    const waitPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        waitS == 2 ? resolve("wait") : resolve("start")
      }, 300);
    });

    waitPromise.then(data=>{data === "start" ? setWaitS(0) : setStopwatchStatus(data) });
  }, [waitS]);

  const start = React.useCallback(() => {
    setStopwatchStatus("start");
  }, [])

  const stop = React.useCallback(() => {
    setStopwatchStatus("stop");
    setTime(0)
  }, []);

  const reset = React.useCallback(() => {
    setTime(0);
  }, []);

  const waitDoubleClick = () => {
    setWaitS(waitS + 1)
  }

  return (
      <div className={style.App}>
        <h1>{timer}</h1>
        <MyBtn symbol={"Start"} onClick={start}/>
        <MyBtn symbol={"Stop"} onClick={stop}/>
        <MyBtn symbol={"Wait"} onClick={waitDoubleClick}/>
        <MyBtn symbol={"Reset"} onClick={reset}/>
      </div>
  );
}

export default App;
