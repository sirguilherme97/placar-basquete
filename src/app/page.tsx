'use client';
import { useEffect, useState } from 'react';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";

export default function Home() {
  const [seconds, setSeconds] = useState(300);
  const [isPaused, setIsPaused] = useState(true); // Estado para controlar a pausa do timer
  const [pontosA, setPontosA] = useState(0)
  const [pontosB, setPontosB] = useState(0)
  const [timeAName, setTimeAName] = useState("Time A");
  const [timeBName, setTimeBName] = useState("Time B");


  function somarTresA() {
    setPontosA(pontosA + 3)
  }
  function somarDoisA() {
    setPontosA(pontosA + 2)
  }
  function somarUmA() {
    setPontosA(pontosA + 1)
  }
  function somarTresB() {
    setPontosB(pontosB + 3)
  }
  function somarDoisB() {
    setPontosB(pontosB + 2)
  }
  function somarUmB() {
    setPontosB(pontosB + 1)
  }

  useEffect(() => {
    if (!isPaused && seconds > 0) { // Verifica se o timer não está em pausa e ainda há segundos restantes
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPaused, seconds]);

  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;

  const handleTimerToggle = () => {
    setIsPaused(!isPaused); // Inverte o estado de pausa do timer ao clicar no botão
  };

  const handleTimeANameChange = (event: any) => {
    setTimeAName(event.target.value);
  };

  const handleTimeBNameChange = (event: any) => {
    setTimeBName(event.target.value);
  };

  return (
    <main className="bg-zinc-900 text-zinc-50 w-screen h-full">
      <div className="w-screen h-40 flex items-center justify-center">
        <h1 className="font-bold text-[80pt]">{`${minutes}:${formattedSeconds}`}</h1>
      </div>

      <div className="w-screen flex justify-between gap-2">
        <div className="h-52 flex flex-1 flex-col items-center justify-between pt-9 bg-red-500">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-5xl font-bold">{pontosA}</p>
            <input
              type="text"
              value={timeAName}
              onChange={handleTimeANameChange}
              className="pl-5 w-full h-10 bg-red-500 font-bold text-2xl flex items-center justify-center"
            />
          </div>

          <div className="flex w-full h-14 text-zinc-900 bg-zinc-900 gap-1">
            <div className="bg-yellow-500 flex flex-1 items-center justify-center font-bold text-2xl">
              <p className="w-full h-full flex items-center justify-center" onClick={somarTresA}>+3</p>
            </div>
            <div className="bg-yellow-500 flex flex-1 items-center justify-center font-bold text-2xl">
              <p className="w-full h-full flex items-center justify-center" onClick={somarDoisA}>+2</p>
            </div>
            <div className="bg-yellow-500 flex flex-1 items-center justify-center font-bold text-2xl">
              <p className="w-full h-full flex items-center justify-center" onClick={somarUmA}>+1</p>
            </div>
          </div>
        </div>

        <div className="h-52 flex flex-1 flex-col items-center justify-between pt-9 bg-blue-500">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-5xl font-bold">{pontosB}</p>
            <input
              type="text"
              value={timeBName}
              onChange={handleTimeBNameChange}
              className="pl-5 w-full h-10 bg-blue-500 font-bold text-2xl flex items-center justify-center"
            />
          </div>

          <div className="flex w-full h-14 text-zinc-900 bg-zinc-900 gap-1">
            <div className="bg-yellow-500 flex flex-1 items-center justify-center font-bold text-2xl">
              <p className="w-full h-full flex items-center justify-center" onClick={somarTresB}>+3</p>
            </div>
            <div className="bg-yellow-500 flex flex-1 items-center justify-center font-bold text-2xl">
              <p className="w-full h-full flex items-center justify-center" onClick={somarDoisB}>+2</p>
            </div>
            <div className="bg-yellow-500 flex flex-1 items-center justify-center font-bold text-2xl">
              <p className="w-full h-full flex items-center justify-center" onClick={somarUmB}>+1</p>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full h-40 mt-10 flex items-center justify-center'>
        {isPaused ? (
          <AiFillPlayCircle size={120} onClick={handleTimerToggle} />
        ) : (
          <AiFillPauseCircle size={120} onClick={handleTimerToggle} />
        )}
      </div>
    </main>
  );
}
