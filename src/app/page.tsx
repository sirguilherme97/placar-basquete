'use client';
import { useEffect, useState } from 'react';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { GiWhistle, GiCardPlay } from "react-icons/gi";

interface Jogador {
  id: number;
  nome: string;
  pontos: number;
  faltas: number;
  eficiencia?: number;
  time: 'A' | 'B';
  tempoPosse?: number; // Tempo em segundos que o jogador teve a posse
}

interface Falta {
  time: 'A' | 'B';
  jogadorId: number;
  tempo: string;
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
  faltas: Falta[];
  data: string;
  pausas: number;
}

interface HistoricoCombinado {
  time: string;
  timeName: string;
  jogador: string | undefined;
  tipo: 'ponto' | 'falta';
  jogadorId: number;
  tempo: string;
  pontos?: number;
}

interface GameStats {
  jogadorMaisEficiente: Jogador | null;
  jogadorMaisDecisivo: Jogador | null;
  maiorSequenciaPontos: {
    jogador: Jogador;
    sequencia: number;
  } | null;
  maiorSequenciaTime: {
    time: 'A' | 'B';
    sequencia: number;
  } | null;
  jogadorMaisFaltoso: Jogador | null;
  jogadorMaisParticipativo: Jogador | null;
  jogadorMaisTempoSemFalta: Jogador | null;
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
  const [showAddPlayerPopover, setShowAddPlayerPopover] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teamToAddPlayer, setTeamToAddPlayer] = useState<'A' | 'B'>('A');
  const [activeTab, setActiveTab] = useState<'placar' | 'informacoes' | 'estatisticas'>('placar');
  const [games, setGames] = useState<Game[]>([]);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [historicoView, setHistoricoView] = useState<'times' | 'cronologico'>('times');
  const [faltasA, setFaltasA] = useState(0);
  const [faltasB, setFaltasB] = useState(0);
  const [pausas, setPausas] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [showFaltaModal, setShowFaltaModal] = useState(false);
  const [selectedFaltaTeam, setSelectedFaltaTeam] = useState<'A' | 'B'>('A');
  const [selectedPlayer, setSelectedPlayer] = useState<Jogador | null>(null);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [posseBola, setPosseBola] = useState<{time: 'A' | 'B', jogadorId: number} | null>(null);
  const [showPosseBola, setShowPosseBola] = useState(false);
  const [ultimaAtualizacaoPosse, setUltimaAtualizacaoPosse] = useState<number | null>(null);

  function StartSound() {
    new Audio("/apito.webm").play();
    if (isGameStarted) {
      setActiveTab('informacoes');
      setShowFaltaModal(true);
    }
    setIsPaused(true);
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

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
    const savedJogadoresA = localStorage.getItem('jogadoresA');
    const savedJogadoresB = localStorage.getItem('jogadoresB');
    const savedHistoricoA = localStorage.getItem('historicoA');
    const savedHistoricoB = localStorage.getItem('historicoB');
    const savedFaltas = localStorage.getItem('faltas');
    const savedTimeAName = localStorage.getItem('timeAName');
    const savedTimeBName = localStorage.getItem('timeBName');
    const savedGames = localStorage.getItem('games');
    const savedPausas = localStorage.getItem('pausas');
    const savedFaltasA = localStorage.getItem('faltasA');
    const savedFaltasB = localStorage.getItem('faltasB');
      const savedPontosA = localStorage.getItem('pontosA');
      const savedPontosB = localStorage.getItem('pontosB');
      const savedSeconds = localStorage.getItem('seconds');
      const savedIsPaused = localStorage.getItem('isPaused');

    if (savedJogadoresA) setJogadoresA(JSON.parse(savedJogadoresA));
    if (savedJogadoresB) setJogadoresB(JSON.parse(savedJogadoresB));
    if (savedHistoricoA) setHistoricoA(JSON.parse(savedHistoricoA));
    if (savedHistoricoB) setHistoricoB(JSON.parse(savedHistoricoB));
    if (savedFaltas) setFaltas(JSON.parse(savedFaltas));
    if (savedTimeAName) setTimeAName(savedTimeAName);
    if (savedTimeBName) setTimeBName(savedTimeBName);
    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedPausas) setPausas(JSON.parse(savedPausas));
    if (savedFaltasA) setFaltasA(JSON.parse(savedFaltasA));
    if (savedFaltasB) setFaltasB(JSON.parse(savedFaltasB));
      if (savedPontosA) setPontosA(JSON.parse(savedPontosA));
      if (savedPontosB) setPontosB(JSON.parse(savedPontosB));
      if (savedSeconds) setSeconds(JSON.parse(savedSeconds));
      if (savedIsPaused) setIsPaused(JSON.parse(savedIsPaused));
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      // Resetar para valores padrão em caso de erro
      resetarTudo();
    }
  }, []);

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
    setFaltasA(0);
    setFaltasB(0);
    setFaltas([]);
    setPausas(0);
    setIsGameStarted(false);
    setPosseBola(null);
    setShowPosseBola(false);
    setUltimaAtualizacaoPosse(null);

    // Limpar localStorage
    localStorage.removeItem('jogadoresA');
    localStorage.removeItem('jogadoresB');
    localStorage.removeItem('historicoA');
    localStorage.removeItem('historicoB');
    localStorage.removeItem('faltas');
    localStorage.removeItem('faltasA');
    localStorage.removeItem('faltasB');
    localStorage.removeItem('pausas');
    localStorage.removeItem('timeAName');
    localStorage.removeItem('timeBName');
    localStorage.removeItem('games');
    localStorage.removeItem('pontosA');
    localStorage.removeItem('pontosB');
    localStorage.removeItem('seconds');
    localStorage.removeItem('isPaused');
  };

  // Função para importar dados
  const importarDados = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dados = JSON.parse(e.target?.result as string);
          
          // Validar os dados antes de importar
          if (!dados || typeof dados !== 'object') {
            throw new Error('Formato de arquivo inválido');
          }

          // Resetar tudo antes de importar novos dados
          resetarTudo();

          // Importar dados validados
          if (Array.isArray(dados.jogadoresA)) setJogadoresA(dados.jogadoresA);
          if (Array.isArray(dados.jogadoresB)) setJogadoresB(dados.jogadoresB);
          if (Array.isArray(dados.historicoA)) setHistoricoA(dados.historicoA);
          if (Array.isArray(dados.historicoB)) setHistoricoB(dados.historicoB);
          if (Array.isArray(dados.faltas)) setFaltas(dados.faltas);
          if (typeof dados.timeAName === 'string') setTimeAName(dados.timeAName);
          if (typeof dados.timeBName === 'string') setTimeBName(dados.timeBName);
          if (typeof dados.pausas === 'number') setPausas(dados.pausas);
          if (typeof dados.faltasA === 'number') setFaltasA(dados.faltasA);
          if (typeof dados.faltasB === 'number') setFaltasB(dados.faltasB);
          if (typeof dados.pontosA === 'number') setPontosA(dados.pontosA);
          if (typeof dados.pontosB === 'number') setPontosB(dados.pontosB);
          if (typeof dados.seconds === 'number') setSeconds(dados.seconds);
          if (typeof dados.isPaused === 'boolean') setIsPaused(dados.isPaused);

          alert('Dados importados com sucesso!');
        } catch (error) {
          console.error('Erro ao importar dados:', error);
          alert('Erro ao importar dados. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
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
      faltas,
      data: new Date().toLocaleString(),
      pausas
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
    setFaltas(game.faltas);
    setFaltasA(game.faltas.filter(f => f.time === 'A').length);
    setFaltasB(game.faltas.filter(f => f.time === 'B').length);
    setPausas(game.pausas);
    setShowGamesModal(false);
  };

  // Função para deletar um game salvo
  const deletarGame = (gameId: string) => {
    setGames(games.filter(game => game.id !== gameId));
  };

  // Função para combinar e ordenar os históricos
  const getHistoricoCombinado = (): HistoricoCombinado[] => {
    const historicoCombinado: HistoricoCombinado[] = [
      ...historicoA.map(ponto => ({
        time: 'A' as const,
        timeName: timeAName,
        jogador: jogadoresA.find(j => j.id === ponto.jogadorId)?.nome,
        tipo: 'ponto' as const,
        jogadorId: ponto.jogadorId,
        tempo: ponto.tempo,
        pontos: ponto.pontos
      })),
      ...historicoB.map(ponto => ({
        time: 'B' as const,
        timeName: timeBName,
        jogador: jogadoresB.find(j => j.id === ponto.jogadorId)?.nome,
        tipo: 'ponto' as const,
        jogadorId: ponto.jogadorId,
        tempo: ponto.tempo,
        pontos: ponto.pontos
      })),
      ...faltas.map(falta => ({
        time: falta.time,
        timeName: falta.time === 'A' ? timeAName : timeBName,
        jogador: (falta.time === 'A' ? jogadoresA : jogadoresB).find(j => j.id === falta.jogadorId)?.nome,
        tipo: 'falta' as const,
        jogadorId: falta.jogadorId,
        tempo: falta.tempo
      }))
    ].sort((a, b) => {
      const [minA, secA] = a.tempo.split(':').map(Number);
      const [minB, secB] = b.tempo.split(':').map(Number);
      return (minB * 60 + secB) - (minA * 60 + secA);
    });

    return historicoCombinado;
  };

  // Função para exportar dados do localStorage
  const exportarDados = () => {
    const dados = {
      games,
      jogadoresA,
      jogadoresB,
      historicoA,
      historicoB,
      faltas,
      timeAName,
      timeBName,
      pausas,
      faltasA,
      faltasB,
      dataExportacao: new Date().toLocaleString()
    };

    const dadosJSON = JSON.stringify(dados, null, 2);
    const blob = new Blob([dadosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placar-basquete-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Função para calcular estatísticas do jogador
  const getPlayerStats = (jogador: Jogador) => {
    const pontos = jogador.time === 'A' 
      ? historicoA.filter(p => p.jogadorId === jogador.id)
      : historicoB.filter(p => p.jogadorId === jogador.id);
    
    const jogadorFaltas = faltas.filter((f: Falta) => f.jogadorId === jogador.id && f.time === jogador.time);
    
    return {
      pontos,
      faltas: jogadorFaltas,
      totalPontos: pontos.reduce((sum, p) => sum + p.pontos, 0),
      totalFaltas: jogadorFaltas.length
    };
  };

  // Função para mostrar detalhes do jogador
  const showPlayerInfo = (jogador: Jogador) => {
    setSelectedPlayer(jogador);
    setShowPlayerDetails(true);
  };

  // Função para calcular estatísticas do jogo
  const getGameStats = (): GameStats => {
    const todosJogadores = [...jogadoresA, ...jogadoresB];
    const historicoCombinado = getHistoricoCombinado();
    
    // Calcular maior sequência de pontos por jogador
    const sequenciasJogadores = todosJogadores.map(jogador => {
      let sequenciaAtual = 0;
      let maiorSequencia = 0;
      
      historicoCombinado.forEach(evento => {
        if (evento.tipo === 'ponto' && evento.jogadorId === jogador.id) {
          sequenciaAtual++;
          maiorSequencia = Math.max(maiorSequencia, sequenciaAtual);
        } else {
          sequenciaAtual = 0;
        }
      });
      
      return { jogador, sequencia: maiorSequencia };
    });

    // Calcular maior sequência de pontos por time
    const sequenciasTimes = [
      { time: 'A' as const, sequencia: 0 },
      { time: 'B' as const, sequencia: 0 }
    ];
    
    let sequenciaAtualA = 0;
    let sequenciaAtualB = 0;
    
    historicoCombinado.forEach(evento => {
      if (evento.tipo === 'ponto') {
        if (evento.time === 'A') {
          sequenciaAtualA++;
          sequenciaAtualB = 0;
          sequenciasTimes[0].sequencia = Math.max(sequenciasTimes[0].sequencia, sequenciaAtualA);
        } else {
          sequenciaAtualB++;
          sequenciaAtualA = 0;
          sequenciasTimes[1].sequencia = Math.max(sequenciasTimes[1].sequencia, sequenciaAtualB);
        }
      } else {
        sequenciaAtualA = 0;
        sequenciaAtualB = 0;
      }
    });

    // Calcular jogador que ficou mais tempo sem falta
    const ultimaFaltaPorJogador = new Map<number, number>();
    const tempoSemFalta = new Map<number, number>();
    
    historicoCombinado.forEach((evento, index) => {
      if (evento.tipo === 'falta') {
        ultimaFaltaPorJogador.set(evento.jogadorId, index);
      }
    });
    
    todosJogadores.forEach(jogador => {
      const ultimaFalta = ultimaFaltaPorJogador.get(jogador.id);
      tempoSemFalta.set(jogador.id, ultimaFalta === undefined ? historicoCombinado.length : historicoCombinado.length - ultimaFalta);
    });

    return {
      jogadorMaisEficiente: todosJogadores
        .filter(j => j.faltas > 0)
        .sort((a, b) => (b.pontos / b.faltas) - (a.pontos / a.faltas))[0] || null,
      jogadorMaisDecisivo: todosJogadores
        .sort((a, b) => b.pontos - a.pontos)[0] || null,
      maiorSequenciaPontos: sequenciasJogadores
        .sort((a, b) => b.sequencia - a.sequencia)[0] || null,
      maiorSequenciaTime: sequenciasTimes
        .sort((a, b) => b.sequencia - a.sequencia)[0] || null,
      jogadorMaisFaltoso: todosJogadores
        .sort((a, b) => b.faltas - a.faltas)[0] || null,
      jogadorMaisParticipativo: todosJogadores
        .sort((a, b) => (b.pontos + b.faltas) - (a.pontos + a.faltas))[0] || null,
      jogadorMaisTempoSemFalta: todosJogadores
        .sort((a, b) => (tempoSemFalta.get(b.id) || 0) - (tempoSemFalta.get(a.id) || 0))[0] || null
    };
  };

  // Função para lidar com o toque e segurar no jogador
  const handleTouchStart = (jogador: Jogador) => {
    setShowPosseBola(true);
    setPosseBola({ time: jogador.time, jogadorId: jogador.id });
  };

  const handleTouchEnd = () => {
    setShowPosseBola(false);
  };

  // Atualizar tempo de posse
  useEffect(() => {
    if (posseBola && showPosseBola && !isPaused) {
      const agora = Date.now();
      if (ultimaAtualizacaoPosse) {
        const tempoDecorrido = (agora - ultimaAtualizacaoPosse) / 1000; // Converter para segundos
        
        if (posseBola.time === 'A') {
          setJogadoresA(jogadoresA.map(j => 
            j.id === posseBola.jogadorId 
              ? { ...j, tempoPosse: (j.tempoPosse || 0) + tempoDecorrido }
              : j
          ));
        } else {
          setJogadoresB(jogadoresB.map(j => 
            j.id === posseBola.jogadorId 
              ? { ...j, tempoPosse: (j.tempoPosse || 0) + tempoDecorrido }
              : j
          ));
        }
      }
      setUltimaAtualizacaoPosse(agora);
    }
  }, [posseBola, showPosseBola, isPaused]);

  // Funções para reiniciar os valores do Time A e Time B
  const handleRestartA = () => {
    setTimeAName("Time A");
    setPontosA(0);
  };

  const handleRestartB = () => {
    setTimeBName("Time B");
    setPontosB(0);
  };

  // Funções para atualizar o nome do Time A e Time B
  const handleTimeANameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeAName(event.target.value);
  };

  const handleTimeBNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeBName(event.target.value);
  };

  // Funções para atualizar o timer e os pontos
  const handleTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeconds(Number(event.target.value));
  };

  const handlePontosA = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPontosA(Number(event.target.value));
  };

  const handlePontosB = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPontosB(Number(event.target.value));
  };

  // Função para alternar entre pausar e retomar o timer
  const handleTimerToggle = () => {
    if (!isPaused && isGameStarted) {
      setPausas(pausas + 1);
    }
    setIsPaused(!isPaused);
    if (!isGameStarted) {
      setIsGameStarted(true);
    }
  };

  // Função para abrir o popover de seleção de jogador
  const handlePointClick = (team: 'A' | 'B', points: number) => {
    setSelectedTeam(team);
    setSelectedPoints(points);
    setShowPopover(true);
    setIsPaused(true);
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
      setJogadoresA(jogadoresA.map(j =>
        j.id === jogadorId ? { ...j, pontos: j.pontos + selectedPoints } : j
      ));
    } else {
      setHistoricoB([...historicoB, novoPonto]);
      setPontosB((+pontosB + selectedPoints).toString());
      setJogadoresB(jogadoresB.map(j =>
        j.id === jogadorId ? { ...j, pontos: j.pontos + selectedPoints } : j
      ));
    }

    setShowPopover(false);
  };

  // Função para abrir o popover de adicionar jogador
  const openAddPlayerPopover = (team: 'A' | 'B') => {
    setTeamToAddPlayer(team);
    setNewPlayerName('');
    setShowAddPlayerPopover(true);
  };

  // Função para adicionar jogador
  const adicionarJogador = () => {
    if (!newPlayerName.trim()) return;

    const novoJogador: Jogador = {
      id: teamToAddPlayer === 'A' ? jogadoresA.length + 1 : jogadoresB.length + 1,
      nome: newPlayerName.trim(),
      pontos: 0,
      faltas: 0,
      time: teamToAddPlayer,
      tempoPosse: 0
    };

    if (teamToAddPlayer === 'A') {
      setJogadoresA([...jogadoresA, novoJogador]);
    } else {
      setJogadoresB([...jogadoresB, novoJogador]);
    }

    setShowAddPlayerPopover(false);
    setNewPlayerName('');
  };

  // Função para obter o top 3 MVP
  const getTop3MVP = () => {
    const todosJogadores = [...jogadoresA.map(j => ({ ...j, time: 'A' })), ...jogadoresB.map(j => ({ ...j, time: 'B' }))];
    return todosJogadores
      .filter(j => j.pontos > 0)
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, 3);
  };

  // Formatação do tempo
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;

  // useEffect para controlar a contagem regressiva do timer
  useEffect(() => {
    if (!isPaused && seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPaused, seconds]);

  // Função para formatar o tempo em HH:mm:ss
  const formatarTempo = (segundos: number) => {
    const segundosInteiro = Math.floor(segundos); // Arredonda para baixo
    const horas = Math.floor(segundosInteiro / 3600);
    const minutos = Math.floor((segundosInteiro % 3600) / 60);
    const segundosRestantes = segundosInteiro % 60;
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  return (
    <main className="bg-zinc-900 text-zinc-50 w-screen h-full">
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
            <div className="mt-4 flex gap-2">
              <button
                className="w-full p-2 bg-green-500 rounded hover:bg-green-600"
                onClick={salvarGame}
              >
                Salvar Game Atual
              </button>
              <button
                className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
                onClick={exportarDados}
              >
                Exportar Dados
              </button>
              <label className="w-full p-2 bg-yellow-500 rounded hover:bg-yellow-600 text-center cursor-pointer">
                Importar Dados
                <input
                  type="file"
                  accept=".json"
                  onChange={importarDados}
                  className="hidden"
                />
              </label>
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
          className={`px-4 py-2 rounded ${activeTab === 'informacoes' ? 'bg-blue-500' : 'bg-zinc-700'}`}
          onClick={() => setActiveTab('informacoes')}
        >
          Informações
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'estatisticas' ? 'bg-blue-500' : 'bg-zinc-700'}`}
          onClick={() => setActiveTab('estatisticas')}
        >
          Estatísticas
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
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl cursor-pointer"
                  onClick={() => handlePointClick('A', 3)}
                >
                  <p className="w-full h-full flex items-center justify-center">+3</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl cursor-pointer"
                  onClick={() => handlePointClick('A', 2)}
                >
                  <p className="w-full h-full flex items-center justify-center">+2</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl cursor-pointer"
                  onClick={() => handlePointClick('A', 1)}
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

              <div className="flex w-full h-14 text-zinc-900 bg-zinc-900 gap-1 select-none">
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl cursor-pointer"
                  onClick={() => handlePointClick('B', 3)}
                >
                  <p className="w-full h-full flex items-center justify-center">+3</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl cursor-pointer"
                  onClick={() => handlePointClick('B', 2)}
                >
                  <p className="w-full h-full flex items-center justify-center">+2</p>
                </div>
                <div
                  className="bg-yellow-500 active:bg-yellow-700 transition-all flex flex-1 items-center justify-center font-bold text-2xl cursor-pointer"
                  onClick={() => handlePointClick('B', 1)}
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
                <div className="flex gap-4 mb-4">
                  {/* Boxes dos jogadores do Time A */}
                  <div className="flex flex-col gap-2">
                    {jogadoresA.map((jogador) => (
                      <div
                        key={jogador.id}
                        className={`p-2 rounded cursor-pointer transition-all ${
                          posseBola?.jogadorId === jogador.id && showPosseBola
                            ? 'bg-yellow-500 text-zinc-900'
                            : 'bg-zinc-800 hover:bg-white hover:text-red-500'
                        }`}
                        onTouchStart={() => handleTouchStart(jogador)}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={() => handleTouchStart(jogador)}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                      >
                        <p className="font-bold">{jogador.nome}</p>
                        <p className="text-sm text-zinc-400">{jogador.pontos} pts</p>
                      </div>
                    ))}
                  </div>

                  {/* Botões de controle */}
                  <div className="flex flex-col items-center">
                <AiFillPauseCircle size={120} onClick={handleTimerToggle} />
                <GiWhistle onClick={StartSound} size={120} />
                  </div>

                  {/* Boxes dos jogadores do Time B */}
                  <div className="flex flex-col gap-2">
                    {jogadoresB.map((jogador) => (
                      <div
                        key={jogador.id}
                        className={`p-2 rounded cursor-pointer transition-all ${
                          posseBola?.jogadorId === jogador.id && showPosseBola
                            ? 'bg-yellow-500 text-zinc-900'
                            : 'bg-zinc-800 hover:bg-white hover:text-blue-500'
                        }`}
                        onTouchStart={() => handleTouchStart(jogador)}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={() => handleTouchStart(jogador)}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                      >
                        <p className="font-bold">{jogador.nome}</p>
                        <p className="text-sm text-zinc-400">{jogador.pontos} pts</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Popover para seleção de jogador */}
          {showPopover && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
      ) : activeTab === 'informacoes' ? (
        <div className="mt-8 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold">Informações do Jogo</h2>
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
                <div className="space-y-4">
                  {jogadoresA.map((jogador) => {
                    const stats = getPlayerStats(jogador);
                    return (
                      <div 
                        key={jogador.id} 
                        className="bg-zinc-800 p-4 rounded-lg cursor-pointer hover:bg-zinc-700"
                        onClick={() => showPlayerInfo(jogador)}
                      >
              <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold">{jogador.nome}</p>
                            {stats.totalFaltas > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <GiCardPlay className="text-yellow-500" size={20} />
                                <span className="text-sm text-zinc-400">{stats.totalFaltas} falta{stats.totalFaltas > 1 ? 's' : ''}</span>
                </div>
                            )}
                </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-500">{stats.totalPontos} pts</p>
                            <p className="text-sm text-zinc-400">
                              {stats.pontos.length} {stats.pontos.length === 1 ? 'cesta' : 'cestas'}
                            </p>
              </div>
              </div>
            </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{timeBName}</h3>
                <div className="space-y-4">
                  {jogadoresB.map((jogador) => {
                    const stats = getPlayerStats(jogador);
                    return (
                      <div 
                        key={jogador.id} 
                        className="bg-zinc-800 p-4 rounded-lg cursor-pointer hover:bg-zinc-700"
                        onClick={() => showPlayerInfo(jogador)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold">{jogador.nome}</p>
                            {stats.totalFaltas > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <GiCardPlay className="text-yellow-500" size={20} />
                                <span className="text-sm text-zinc-400">{stats.totalFaltas} falta{stats.totalFaltas > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-500">{stats.totalPontos} pts</p>
                            <p className="text-sm text-zinc-400">
                              {stats.pontos.length} {stats.pontos.length === 1 ? 'cesta' : 'cestas'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-2">
                {getHistoricoCombinado().map((item, index) => (
                  <div key={index} className={`${item.tipo === 'ponto' ? 'bg-zinc-800' : 'bg-zinc-800'} p-3 rounded w-full flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      {item.tipo === 'ponto' ? (
                        <>
                          <span className="text-yellow-500 font-bold">+{(item as Ponto).pontos}</span>
                          <span className="text-zinc-400">|</span>
                          <span className="font-medium">{item.jogador}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-bold">Falta</span>
                          <span className="text-zinc-400">|</span>
                          <span className="font-medium">{item.jogador}</span>
                        </>
                      )}
                      <span className="text-zinc-400">|</span>
                      <span className={`font-bold ${item.time === 'A' ? 'text-red-500' : 'text-blue-500'}`}>
                        {item.timeName}
                      </span>
                    </div>
                    <span className="text-base font-bold text-zinc-300">{item.tempo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal de detalhes do jogador */}
          {showPlayerDetails && selectedPlayer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-zinc-800 p-6 rounded-lg w-11/12 max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{selectedPlayer.nome}</h2>
                  <button
                    className="p-2 bg-red-500 rounded hover:bg-red-600"
                    onClick={() => setShowPlayerDetails(false)}
                  >
                    Fechar
                  </button>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Estatísticas Gerais</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-bold">{selectedPlayer.time === 'A' ? timeAName : timeBName}</span>
            </div>
                      <div className="flex justify-between">
                        <span>Total de Pontos:</span>
                        <span className="font-bold text-yellow-500">{getPlayerStats(selectedPlayer).totalPontos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de Faltas:</span>
                        <span className="font-bold text-red-500">{getPlayerStats(selectedPlayer).totalFaltas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Número de Cestas:</span>
                        <span className="font-bold">{getPlayerStats(selectedPlayer).pontos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eficiência (Pontos/Falta):</span>
                        <span className="font-bold">
                          {selectedPlayer.faltas > 0 
                            ? (selectedPlayer.pontos / selectedPlayer.faltas).toFixed(1)
                            : selectedPlayer.pontos > 0 ? '∞' : '0.0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo de Posse:</span>
                        <span className="font-bold">
                          {formatarTempo(selectedPlayer.tempoPosse || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Distribuição de Pontos</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pontos de 3:</span>
                        <span className="font-bold">
                          {getPlayerStats(selectedPlayer).pontos.filter(p => p.pontos === 3).length} cestas
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pontos de 2:</span>
                        <span className="font-bold">
                          {getPlayerStats(selectedPlayer).pontos.filter(p => p.pontos === 2).length} cestas
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pontos de 1:</span>
                        <span className="font-bold">
                          {getPlayerStats(selectedPlayer).pontos.filter(p => p.pontos === 1).length} cestas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">Histórico de Pontos</h3>
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <div className="space-y-2">
                      {getPlayerStats(selectedPlayer).pontos.map((ponto, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-yellow-500 font-bold">+{ponto.pontos}</span>
                          <span className="text-zinc-400">{ponto.tempo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">Histórico de Faltas</h3>
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <div className="space-y-2">
                      {getPlayerStats(selectedPlayer).faltas.map((falta, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-red-500 font-bold">Falta</span>
                          <span className="text-zinc-400">{falta.tempo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 p-4">
          <h2 className="text-2xl font-bold mb-6">Estatísticas Detalhadas</h2>
          
          {/* Aproveitamento */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Aproveitamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Média de Pontos por Jogador</h4>
                <p className="text-2xl font-bold text-yellow-500">
                  {((+pontosA + +pontosB) / (jogadoresA.length + jogadoresB.length)).toFixed(1)}
                </p>
              </div>
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Média de Pontos por Time</h4>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">{timeAName}</p>
                    <p className="text-xl font-bold text-red-500">{(+pontosA / jogadoresA.length).toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm">{timeBName}</p>
                    <p className="text-xl font-bold text-blue-500">{(+pontosB / jogadoresB.length).toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Faltas e Pausas */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Faltas e Pausas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Faltas</h4>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">{timeAName}</p>
                    <p className="text-xl font-bold text-red-500">{faltasA}</p>
                  </div>
                  <div>
                    <p className="text-sm">{timeBName}</p>
                    <p className="text-xl font-bold text-blue-500">{faltasB}</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Pausas</h4>
                <p className="text-2xl font-bold text-yellow-500">{pausas}</p>
              </div>
            </div>
          </div>

          {/* Top 3 MVP */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Top 3 MVP</h3>
              {getTop3MVP().length > 0 ? (
                <div className="space-y-2">
                  {getTop3MVP().map((jogador, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-yellow-500">{jogador.nome}</p>
                        <p className="text-sm text-zinc-400">
                          {jogador.time === 'A' ? timeAName : timeBName}
                        </p>
                      </div>
                      <p className="text-xl font-bold">{jogador.pontos} pts</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-zinc-400">Nenhum ponto marcado ainda</p>
              )}
          </div>

          {/* Destaques */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Destaques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Jogador Mais Eficiente</h4>
                {getGameStats().jogadorMaisEficiente && (
              <div>
                    <p className="text-lg font-bold">
                      {getGameStats().jogadorMaisEficiente?.nome}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {getGameStats().jogadorMaisEficiente ? 
                        ((getGameStats().jogadorMaisEficiente?.pontos || 0) / (getGameStats().jogadorMaisEficiente?.faltas || 1)).toFixed(1) : 
                        '0.0'} pts/falta
                    </p>
                          </div>
                )}
                        </div>
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Jogador Mais Decisivo</h4>
                {getGameStats().jogadorMaisDecisivo && (
                  <div>
                    <p className="text-lg font-bold">
                      {getGameStats().jogadorMaisDecisivo?.nome}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {getPlayerStats(getGameStats().jogadorMaisDecisivo!).totalPontos} pontos nos últimos 5 minutos
                    </p>
                </div>
                )}
              </div>
                          </div>
                        </div>

          {/* Outros */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Outros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Tempo de Jogo</h4>
                <p className="text-2xl font-bold text-yellow-500">
                  {Math.floor((300 - seconds) / 60)}:{((300 - seconds) % 60).toString().padStart(2, '0')}
                </p>
                </div>
              </div>
            </div>

          {/* Posse de Bola */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Posse de Bola</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">{timeAName}</h4>
              <div className="space-y-2">
                  {jogadoresA.map((jogador) => (
                    <div key={jogador.id} className="flex justify-between items-center">
                      <span>{jogador.nome}</span>
                      <span className="font-bold">
                        {formatarTempo(jogador.tempoPosse || 0)}
                      </span>
                  </div>
                ))}
              </div>
            </div>
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">{timeBName}</h4>
                <div className="space-y-2">
                  {jogadoresB.map((jogador) => (
                    <div key={jogador.id} className="flex justify-between items-center">
                      <span>{jogador.nome}</span>
                      <span className="font-bold">
                        {formatarTempo(jogador.tempoPosse || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
