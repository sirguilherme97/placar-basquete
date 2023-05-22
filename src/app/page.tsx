'use client';
import { useEffect, useState } from 'react';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
export default function Home() {
  const [seconds, setSeconds] = useState<any>(300);
  const [isPaused, setIsPaused] = useState<any>(true); // Estado para controlar a pausa do timer
  const [pontosA, setPontosA] = useState<any>(0)
  const [pontosB, setPontosB] = useState<any>(0)
  const [timeAName, setTimeAName] = useState<any>("Time A");
  const [timeBName, setTimeBName] = useState<any>("Time B");


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
    const savedPontosA = parseInt(getCookie('pontosA'));
    const savedPontosB = parseInt(getCookie('pontosB'));
    const savedTimeAName = getCookie('timeAName');
    const savedTimeBName = getCookie('timeBName');

    if (!isNaN(savedPontosA)) {
      setPontosA(savedPontosA);
    }

    if (!isNaN(savedPontosB)) {
      setPontosB(savedPontosB);
    }

    if (savedTimeAName) {
      setTimeAName(savedTimeAName);
    }

    if (savedTimeBName) {
      setTimeBName(savedTimeBName);
    }
  }, []);

  useEffect(() => {
    setCookie('pontosA', pontosA.toString() || '', 14);
  }, [pontosA]);

  useEffect(() => {
    setCookie('pontosB', pontosB.toString() || '', 14);
  }, [pontosB]);

  useEffect(() => {
    setCookie('timeAName', timeAName, 14);
  }, [timeAName]);

  useEffect(() => {
    setCookie('timeBName', timeBName, 14);
  }, [timeBName]);

  // Função para obter o valor de um cookie
  const getCookie = (name: any) => {
    const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return cookieValue ? cookieValue[2] : null;
  };

  // Função para definir o valor de um cookie
  const setCookie = (name: any, value: any, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
  };

  function handleRestartA() {
    setTimeAName("Time A");
    setPontosA(0);
  };
  function handleRestartB() {
    setTimeBName("Time B");
    setPontosB(0);
  };


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
  const handleTimer = (event: any) => {
    setSeconds(event.target.value);
  };

  const handlePontosA = (event: any) => {
    setPontosA(event.target.value);
  };

  const handlePontosB = (event: any) => {
    setPontosB(event.target.value);
  };
  return (
    <main className="bg-zinc-900 text-zinc-50 w-screen h-full">
      <div className="w-screen h-40 flex items-center justify-center">
        <h1 className="font-bold text-[80pt]">{`${minutes}:${formattedSeconds}`}</h1>
      </div>

      <div className="w-screen flex justify-between gap-2">
        <div className="h-52 flex flex-1 flex-col items-center justify-between pt-9 bg-red-500">
          <div className="relative flex flex-col items-center justify-center gap-3">
            <p className="text-5xl font-bold">{pontosA}</p>
            <VscDebugRestart onClick={handleRestartA} size={20} className='absolute right-0 -top-8' />
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
          <div className="relative flex flex-col items-center justify-center gap-3">
            <p className="text-5xl font-bold">{pontosB}</p>
            <VscDebugRestart onClick={handleRestartB} size={20} className='absolute right-0 -top-8' />
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

      <div className='w-full h-auto mt-10 flex items-center gap-10 justify-center'>
        {isPaused ? (
          <div className='flex flex-col pt-10 items-center justify-center'>
            <AiFillPlayCircle size={120} onClick={handleTimerToggle} />
            <div className=''>
              <p className='mt-10 '>Tempo de Jogo - SEGUNDOS</p>
              <input
                placeholder='Tempo de Jogo'
                type="number"
                value={seconds}
                onChange={handleTimer}
                className="rounded-md placeholder:text-zinc-500 placeholder:text-lg pl-5 mt-2 w-full h-10 bg-zinc-800 font-bold text-2xl flex items-center justify-center"
              />
              <p className='mt-4 '>{`Pontos: ${timeAName}`}</p>
              <input
                placeholder='Pontos'
                type="number"
                value={pontosA}
                onChange={handlePontosA}
                className="rounded-md placeholder:text-zinc-50 placeholder:text-lg  pl-5 mt-2 w-full h-10 bg-zinc-800 font-bold text-2xl flex items-center justify-center"
              />
              <p className='mt-4 '>{`Pontos: ${timeBName}`}</p>
              <input
                placeholder='Pontos'
                type="number"
                value={pontosB}
                onChange={handlePontosB}
                className="rounded-md mb-20 placeholder:text-zinc-50 placeholder:text-lg pl-5 mt-2 w-full h-10 bg-zinc-800 font-bold text-2xl flex items-center justify-center"
              />
            </div>
          </div>
        ) : (
          <div className='flex flex-col pt-10 items-center justify-center'>
            <AiFillPauseCircle size={120} onClick={handleTimerToggle} />
          </div>
        )}
      </div>


    </main>
  );
}
