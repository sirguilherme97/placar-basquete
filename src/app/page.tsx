'use client';
import { useEffect, useState } from 'react';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { GiWhistle } from "react-icons/gi";

interface Jogador {
  id: number;
  nome: string;
}

interface Ponto {
  jogadorId: number;
  pontos: number;
  tempo: string;
}

interface Game {
  id: string;
  timeAName: string;
  timeBName: string;
  pontosA: number;
  pontosB: number;
  jogadoresA: Jogador[];
  jogadoresB: Jogador[];
  historicoA: Ponto[];
  historicoB: Ponto[];
  data: string;
}

export default function Home() {
  const [seconds, setSeconds] = useState(300); // Estado para controlar o tempo em segundos
  const [isPaused, setIsPaused] = useState(true); // Estado para controlar a pausa do timer
  const [pontosA, setPontosA] = useState<any>(0); // Estado para armazenar os pontos do Time A
  const [pontosB, setPontosB] = useState<any>(0); // Estado para armazenar os pontos do Time B
  const [timeAName, setTimeAName] = useState("Time A"); // Estado para armazenar o nome do Time A
  const [timeBName, setTimeBName] = useState("Time B"); // Estado para armazenar o nome do Time B
  const [jogadoresA, setJogadoresA] = useState<Jogador[]>([]);
  const [jogadoresB, setJogadoresB] = useState<Jogador[]>([]);
  const [historicoA, setHistoricoA] = useState<Ponto[]>([]);
  const [historicoB, setHistoricoB] = useState<Ponto[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showAddPlayerPopover, setShowAddPlayerPopover] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teamToAddPlayer, setTeamToAddPlayer] = useState<'A' | 'B'>('A');
  const [activeTab, setActiveTab] = useState<'placar' | 'historico'>('placar');
  const [games, setGames] = useState<Game[]>([]);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [historicoView, setHistoricoView] = useState<'times' | 'cronologico'>('times');

  function StartSound() {
    new Audio("/apito.webm").play()
    setIsPaused(true)
  }
  // Funções para adicionar pontos ao Time A
  function somarTresA() {
    setPontosA((+pontosA + 3).toString());
    setIsPaused(true);
  }
  function somarDoisA() {
    setPontosA((+pontosA + 2).toString());
    setIsPaused(true);
  }
  function somarUmA() {
    setPontosA((+pontosA + 1).toString());
    setIsPaused(true);
  }

  // Funções para adicionar pontos ao Time B
  function somarTresB() {
    setPontosB((+pontosB + 3).toString());
    setIsPaused(true);
  }
  function somarDoisB() {
    setPontosB((+pontosB + 2).toString());
    setIsPaused(true);
  }
  function somarUmB() {
    setPontosB((+pontosB + 1).toString());
    setIsPaused(true);
  }

  // useEffect para carregar os valores salvos dos cookies ao carregar a página
  useEffect(() => {
    const savedPontosA = parseInt(getCookie('pontosA'));
    const savedPontosB = parseInt(getCookie('pontosB'));
    const savedTimeAName = getCookie('timeAName');
    const savedTimeBName = getCookie('timeBName');
    const savedSeconds = parseInt(getCookie('seconds'));

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

    if (!isNaN(savedSeconds)) {
      setSeconds(savedSeconds);
    }

  }, []);

  // useEffect para salvar o valor dos pontos do Time A no cookie sempre que ele for alterado
  useEffect(() => {
    setCookie('pontosA', pontosA || 0, 14);
  }, [pontosA]);

  // useEffect para salvar o valor dos pontos do Time B no cookie sempre que ele for alterado
  useEffect(() => {
    setCookie('pontosB', pontosB || 0, 14);
  }, [pontosB]);

  // useEffect para salvar o nome do Time A no cookie sempre que ele for alterado
  useEffect(() => {
    setCookie('timeAName', timeAName, 14);
  }, [timeAName]);

  // useEffect para salvar o nome do Time B no cookie sempre que ele for alterado
  useEffect(() => {
    setCookie('timeBName', timeBName, 14);
  }, [timeBName]);

  // useEffect para salvar o tempo em cookie sempre que ele for alterado
  useEffect(() => {
    setCookie('seconds', seconds.toString(), 14);
  }, [seconds]);

  // Função para obter o valor de um cookie
  const getCookie = (name: string) => {
    const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return cookieValue ? cookieValue[2] : '';
  };

  // Função para definir o valor de um cookie
  const setCookie = (name: any, value: any, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
  };

  // Funções para reiniciar os valores do Time A e Time B
  function handleRestartA() {
    setTimeAName("Time A");
    setPontosA(0);
  }
  function handleRestartB() {
    setTimeBName("Time B");
    setPontosB(0);
  }

  // useEffect para controlar a contagem regressiva do timer
  useEffect(() => {
    if (!isPaused && seconds > 0) { // Verifica se o timer não está em pausa e ainda há segundos restantes
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPaused, seconds]);

  const minutes = Math.floor(seconds / 60); // Calcula os minutos restantes
  const formattedSeconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60; // Formata os segundos para exibição

  // Função para alternar entre pausar e retomar o timer
  const handleTimerToggle = () => {
    setIsPaused(!isPaused); // Inverte o estado de pausa do timer ao clicar no botão
  };

  // Funções para atualizar o nome do Time A e Time B ao alterar o valor dos inputs
  const handleTimeANameChange = (event: any) => {
    setTimeAName(event.target.value);
  };
  const handleTimeBNameChange = (event: any) => {
    setTimeBName(event.target.value);
  };

  // Funções para atualizar o valor do timer e dos pontos do Time A e Time B ao alterar o valor dos inputs
  const handleTimer = (event: any) => {
    setSeconds(event.target.value);
  };
  const handlePontosA = (event: any) => {
    setPontosA(event.target.value);
  };
  const handlePontosB = (event: any) => {
    setPontosB(event.target.value);
  };

  // Funções para adicionar jogadores
  const openAddPlayerPopover = (team: 'A' | 'B') => {
    setTeamToAddPlayer(team);
    setNewPlayerName('');
    setShowAddPlayerPopover(true);
  };

  const adicionarJogador = () => {
    if (!newPlayerName.trim()) return;

    const novoJogador: Jogador = {
      id: teamToAddPlayer === 'A' ? jogadoresA.length + 1 : jogadoresB.length + 1,
      nome: newPlayerName.trim()
    };

    if (teamToAddPlayer === 'A') {
      setJogadoresA([...jogadoresA, novoJogador]);
    } else {
      setJogadoresB([...jogadoresB, novoJogador]);
    }

    setShowAddPlayerPopover(false);
    setNewPlayerName('');
  };

  // Funções para lidar com o pressionar e segurar dos botões
  const handleLongPressStart = (team: 'A' | 'B', points: number) => {
    setSelectedTeam(team);
    setSelectedPoints(points);
    const timer = setTimeout(() => {
      setShowPopover(true);
      setIsPaused(true);
    }, 200);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Função para registrar ponto com jogador
  const registrarPonto = (jogadorId: number) => {
    const tempoAtual = `${minutes}:${formattedSeconds}`;
    const novoPonto: Ponto = {
      jogadorId,
      pontos: selectedPoints,
      tempo: tempoAtual
    };

    if (selectedTeam === 'A') {
      setHistoricoA([...historicoA, novoPonto]);
      setPontosA((+pontosA + selectedPoints).toString());
    } else {
      setHistoricoB([...historicoB, novoPonto]);
      setPontosB((+pontosB + selectedPoints).toString());
    }

    setShowPopover(false);
  };

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedJogadoresA = localStorage.getItem('jogadoresA');
    const savedJogadoresB = localStorage.getItem('jogadoresB');
    const savedHistoricoA = localStorage.getItem('historicoA');
    const savedHistoricoB = localStorage.getItem('historicoB');
    const savedTimeAName = localStorage.getItem('timeAName');
    const savedTimeBName = localStorage.getItem('timeBName');
    const savedGames = localStorage.getItem('games');

    if (savedJogadoresA) setJogadoresA(JSON.parse(savedJogadoresA));
    if (savedJogadoresB) setJogadoresB(JSON.parse(savedJogadoresB));
    if (savedHistoricoA) setHistoricoA(JSON.parse(savedHistoricoA));
    if (savedHistoricoB) setHistoricoB(JSON.parse(savedHistoricoB));
    if (savedTimeAName) setTimeAName(savedTimeAName);
    if (savedTimeBName) setTimeBName(savedTimeBName);
    if (savedGames) setGames(JSON.parse(savedGames));
  }, []);

  // Salvar jogadores no localStorage
  useEffect(() => {
    localStorage.setItem('jogadoresA', JSON.stringify(jogadoresA));
  }, [jogadoresA]);

  useEffect(() => {
    localStorage.setItem('jogadoresB', JSON.stringify(jogadoresB));
  }, [jogadoresB]);

  // Salvar histórico no localStorage
  useEffect(() => {
    localStorage.setItem('historicoA', JSON.stringify(historicoA));
  }, [historicoA]);

  useEffect(() => {
    localStorage.setItem('historicoB', JSON.stringify(historicoB));
  }, [historicoB]);

  // Salvar nomes dos times no localStorage
  useEffect(() => {
    localStorage.setItem('timeAName', timeAName);
  }, [timeAName]);

  useEffect(() => {
    localStorage.setItem('timeBName', timeBName);
  }, [timeBName]);

  // Salvar games no localStorage
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  // Função para resetar tudo
  const resetarTudo = () => {
    setJogadoresA([]);
    setJogadoresB([]);
    setHistoricoA([]);
    setHistoricoB([]);
    setPontosA(0);
    setPontosB(0);
    setTimeAName("Time A");
    setTimeBName("Time B");
    setSeconds(300);
    setIsPaused(true);
  };

  // Função para salvar o jogo atual
  const salvarGame = () => {
    const novoGame: Game = {
      id: Date.now().toString(),
      timeAName,
      timeBName,
      pontosA: +pontosA,
      pontosB: +pontosB,
      jogadoresA,
      jogadoresB,
      historicoA,
      historicoB,
      data: new Date().toLocaleString()
    };

    setGames([...games, novoGame]);
  };

  // Função para carregar um game salvo
  const carregarGame = (game: Game) => {
    setTimeAName(game.timeAName);
    setTimeBName(game.timeBName);
    setPontosA(game.pontosA.toString());
    setPontosB(game.pontosB.toString());
    setJogadoresA(game.jogadoresA);
    setJogadoresB(game.jogadoresB);
    setHistoricoA(game.historicoA);
    setHistoricoB(game.historicoB);
    setShowGamesModal(false);
  };

  // Função para deletar um game salvo
  const deletarGame = (gameId: string) => {
    setGames(games.filter(game => game.id !== gameId));
  };

  // Função para combinar e ordenar os históricos
  const getHistoricoCombinado = () => {
    const historicoCombinado = [
      ...historicoA.map(ponto => ({
        ...ponto,
        time: 'A',
        timeName: timeAName,
        jogador: jogadoresA.find(j => j.id === ponto.jogadorId)?.nome
      })),
      ...historicoB.map(ponto => ({
        ...ponto,
        time: 'B',
        timeName: timeBName,
        jogador: jogadoresB.find(j => j.id === ponto.jogadorId)?.nome
      }))
    ].sort((a, b) => {
      const [minA, secA] = a.tempo.split(':').map(Number);
      const [minB, secB] = b.tempo.split(':').map(Number);
      return (minB * 60 + secB) - (minA * 60 + secA);
    });

    return historicoCombinado;
  };

  return (
    <main className="bg-zinc-900 text-zinc-50 w-screen h-full ">
      {/* Botão fixo para salvar game */}
      <button
        className="absolute top-4 right-4 p-3 bg-green-500 rounded-full hover:bg-green-600 z-50"
        onClick={() => setShowGamesModal(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      {/* Modal de games salvos */}
      {showGamesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Games Salvos</h2>
              <button
                className="p-2 bg-red-500 rounded hover:bg-red-600"
                onClick={() => setShowGamesModal(false)}
              >
                Fechar
              </button>
            </div>
            <div className="space-y-4">
              {games.map((game) => (
                <div key={game.id} className="bg-zinc-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">
                        {game.timeAName} vs {game.timeBName}
                      </h3>
                      <p className="text-sm text-zinc-400">{game.data}</p>
                      <p className="mt-2">
                        Placar: {game.pontosA} - {game.pontosB}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => carregarGame(game)}
                      >
                        Carregar
                      </button>
                      <button
                        className="p-2 bg-red-500 rounded hover:bg-red-600"
                        onClick={() => deletarGame(game.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="w-full p-2 bg-green-500 rounded hover:bg-green-600"
                onClick={salvarGame}
              >
                Salvar Game Atual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs de navegação */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'placar' ? 'bg-blue-500' : 'bg-zinc-700'}`}
          onClick={() => setActiveTab('placar')}
        >
          Placar
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'historico' ? 'bg-blue-500' : 'bg-zinc-700'}`}
          onClick={() => setActiveTab('historico')}
        >
          Histórico
        </button>
      </div>

      {activeTab === 'placar' ? (
        <>
          <div className="w-screen h-40 flex items-center justify-center">
            <h1 className="font-bold text-[80pt]">{`${minutes}:${formattedSeconds}`}</h1>
          </div>

          <div className="w-screen flex justify-between gap-2 max-w-[1440px] mx-auto">
            <div className="h-52 flex flex-1 flex-col items-center justify-between pt-9 bg-red-500">
              <div className="relative flex flex-col items-center justify-center gap-3">
                <p className="text-5xl font-bold">{pontosA}</p>
                <VscDebugRestart onClick={handleRestartA} size={20} className='absolute right-0 -top-8' />
                <input
                  type="text"
                  value={timeAName}
                  onChange={handleTimeANameChange}
                  className="pl-5 w-full h-10 bg-red-500 font-bold text-xl flex items-center justify-center"
                />
              </div>

              <div className="flex w-full h-14 text-zinc-900 bg-zinc-900 gap-1 select-none">
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl"
                  onMouseDown={() => handleLongPressStart('A', 3)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('A', 3)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <p className="w-full h-full flex items-center justify-center">+3</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl"
                  onMouseDown={() => handleLongPressStart('A', 2)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('A', 2)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <p className="w-full h-full flex items-center justify-center">+2</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl"
                  onMouseDown={() => handleLongPressStart('A', 1)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('A', 1)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <p className="w-full h-full flex items-center justify-center">+1</p>
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
                  className="pl-5 w-full h-10 bg-blue-500 font-bold text-xl flex items-center justify-center"
                />
              </div>

              <div className="flex w-full h-14 text-zinc-900 bg-zinc-900 gap-1  select-none">
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl"
                  onMouseDown={() => handleLongPressStart('B', 3)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('B', 3)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <p className="w-full h-full flex items-center justify-center">+3</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl"
                  onMouseDown={() => handleLongPressStart('B', 2)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('B', 2)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <p className="w-full h-full flex items-center justify-center">+2</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl"
                  onMouseDown={() => handleLongPressStart('B', 1)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('B', 1)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <p className="w-full h-full flex items-center justify-center">+1</p>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full h-auto mt-10 flex items-center gap-10 justify-center'>
            {isPaused ? (
              <div className='flex mb-10 flex-col pt-10 items-center justify-center'>
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
                  <p className='mt-2'>Pontos do {`${timeAName}`}</p>
                  <input
                    placeholder='Pontos do Time A'
                    type="number"
                    value={pontosA}
                    onChange={handlePontosA}
                    className="rounded-md placeholder:text-zinc-500 placeholder:text-lg pl-5 mt-2 w-full h-10 bg-zinc-800 font-bold text-2xl flex items-center justify-center"
                  />
                  <p className='mt-2'>Pontos do {`${timeBName}`}</p>
                  <input
                    placeholder='Pontos do Time B'
                    type="number"
                    value={pontosB}
                    onChange={handlePontosB}
                    className="rounded-md placeholder:text-zinc-500 placeholder:text-lg pl-5 mt-2 w-full h-10 bg-zinc-800 font-bold text-2xl flex items-center justify-center"
                  />
                </div>
              </div>
            ) : (
              <div className='flex flex-col pt-10 items-center justify-center'>
                <AiFillPauseCircle size={120} onClick={handleTimerToggle} />
                <GiWhistle onClick={StartSound} size={120} />
              </div>
            )}
          </div>

          {/* Popover para seleção de jogador */}
          {showPopover && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-zinc-800 p-4 rounded-lg w-80">
                <h3 className="text-xl font-bold mb-4">Selecione o jogador</h3>
                <div className="space-y-2">
                  {(selectedTeam === 'A' ? jogadoresA : jogadoresB).map((jogador) => (
                    <button
                      key={jogador.id}
                      className="w-full p-2 bg-zinc-700 rounded hover:bg-zinc-600"
                      onClick={() => registrarPonto(jogador.id)}
                    >
                      {jogador.nome}
                    </button>
                  ))}
                </div>
                <button
                  className="mt-4 w-full p-2 bg-red-500 rounded hover:bg-red-600"
                  onClick={() => setShowPopover(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Botões para adicionar jogadores */}
          {isPaused && (
            <div className="flex justify-center gap-4 mt-5 mb-10">
              <button
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                onClick={() => openAddPlayerPopover('A')}
              >
                Adicionar Jogador A
              </button>
              <button
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => openAddPlayerPopover('B')}
              >
                Adicionar Jogador B
              </button>
            </div>
          )}

          {/* Popover para adicionar jogador */}
          {showAddPlayerPopover && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-zinc-800 p-4 rounded-lg w-80">
                <h3 className="text-xl font-bold mb-4">Adicionar Jogador - Time {teamToAddPlayer}</h3>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Nome do jogador"
                  className="w-full p-2 bg-zinc-700 rounded mb-4"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarJogador()}
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 p-2 bg-green-500 rounded hover:bg-green-600"
                    onClick={adicionarJogador}
                  >
                    Adicionar
                  </button>
                  <button
                    className="flex-1 p-2 bg-red-500 rounded hover:bg-red-600"
                    onClick={() => setShowAddPlayerPopover(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold">Histórico de Pontos</h2>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${historicoView === 'times' ? 'bg-blue-500' : 'bg-zinc-700'}`}
                  onClick={() => setHistoricoView('times')}
                >
                  Por Time
                </button>
                <button
                  className={`px-3 py-1 rounded ${historicoView === 'cronologico' ? 'bg-blue-500' : 'bg-zinc-700'}`}
                  onClick={() => setHistoricoView('cronologico')}
                >
                  Cronológico
                </button>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              onClick={resetarTudo}
            >
              Resetar Tudo
            </button>
          </div>

          {historicoView === 'times' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{timeAName}</h3>
                <div className="space-y-2">
                  {historicoA
                    .sort((a, b) => {
                      const [minA, secA] = a.tempo.split(':').map(Number);
                      const [minB, secB] = b.tempo.split(':').map(Number);
                      return (minB * 60 + secB) - (minA * 60 + secA);
                    })
                    .map((ponto, index) => {
                      const jogador = jogadoresA.find(j => j.id === ponto.jogadorId);
                      return (
                        <div key={index} className="bg-zinc-800 p-3 rounded flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 font-bold">+{ponto.pontos}</span>
                            <span className="text-zinc-400">|</span>
                            <span className="font-medium">{jogador?.nome}</span>
                          </div>
                          <span className="text-sm text-zinc-400">{ponto.tempo}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{timeBName}</h3>
                <div className="space-y-2">
                  {historicoB
                    .sort((a, b) => {
                      const [minA, secA] = a.tempo.split(':').map(Number);
                      const [minB, secB] = b.tempo.split(':').map(Number);
                      return (minB * 60 + secB) - (minA * 60 + secA);
                    })
                    .map((ponto, index) => {
                      const jogador = jogadoresB.find(j => j.id === ponto.jogadorId);
                      return (
                        <div key={index} className="bg-zinc-800 p-3 rounded flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 font-bold">+{ponto.pontos}</span>
                            <span className="text-zinc-400">|</span>
                            <span className="font-medium">{jogador?.nome}</span>
                          </div>
                          <span className="text-sm text-zinc-400">{ponto.tempo}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-2">
                {getHistoricoCombinado().map((ponto, index) => (
                  <div key={index} className="bg-zinc-800 p-3 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${ponto.time === 'A' ? 'text-red-500' : 'text-blue-500'}`}>
                        {ponto.timeName}
                      </span>
                      <span className="text-zinc-400">|</span>
                      <span className="text-yellow-500 font-bold">+{ponto.pontos}</span>
                      <span className="text-zinc-400">|</span>
                      <span className="font-medium">{ponto.jogador}</span>
                    </div>
                    <span className="text-sm text-zinc-400">{ponto.tempo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
