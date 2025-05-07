'use client';
import { useEffect, useState } from 'react';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { GiWhistle, GiCardPlay } from "react-icons/gi";

interface Jogador {
  id: number; // Número único (timestamp)
  nome: string;
  pontos: number;
  faltas: number;
  eficiencia?: number;
  time: 'A' | 'B' | null;
  tempoPosse?: number; // Tempo em segundos que o jogador teve a posse
  stamina: number; // Nova propriedade para controlar a estamina do jogador
  historicoTimes?: { time: 'A' | 'B', pontos: number, faltas: number }[]; // Histórico de times
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
  faltasA: number;
  faltasB: number;
  seconds: number;
  isPaused: boolean;
  isGameStarted: boolean;
  posseBola: { time: 'A' | 'B', jogadorId: number } | null;
  ultimaAtualizacaoPosse: number | null;
  tempoInicio: number | null;
  tempoFim: number | null;
  tempoJogo?: number; // Tempo de jogo em segundos
  jogadoresBanco?: Jogador[]; // Lista de jogadores no banco
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

interface EstadoJogo {
  jogadoresA: Jogador[];
  jogadoresB: Jogador[];
  jogadoresBanco: Jogador[];
  historicoA: Ponto[];
  historicoB: Ponto[];
  faltas: Falta[];
  timeAName: string;
  timeBName: string;
  games: Game[];
  pausas: number;
  faltasA: number;
  faltasB: number;
  pontosA: number;
  pontosB: number;
  seconds: number;
  isPaused: boolean;
  isGameStarted: boolean;
  posseBola: { time: 'A' | 'B', jogadorId: number } | null;
  ultimaAtualizacaoPosse: number | null;
  tempoInicio: number | null;
  tempoFim: number | null;
  aproveitamento: {
    mediaPontosJogador: string;
    mediaPontosTimeA: string;
    mediaPontosTimeB: string;
  };
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
  const [jogadoresBanco, setJogadoresBanco] = useState<Jogador[]>([]);
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
  const [posseBola, setPosseBola] = useState<{ time: 'A' | 'B', jogadorId: number } | null>(null);
  const [ultimaAtualizacaoPosse, setUltimaAtualizacaoPosse] = useState<number | null>(null);
  const [tempoInicio, setTempoInicio] = useState<number | null>(null);
  const [tempoFim, setTempoFim] = useState<number | null>(null);
  const [aproveitamento, setAproveitamento] = useState<EstadoJogo['aproveitamento'] | null>(null);
  const [showAddBenchPlayerPopover, setShowAddBenchPlayerPopover] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [jogadorParaRemover, setJogadorParaRemover] = useState<Jogador | null>(null);

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

  // useEffect para salvar pontosA e pontosB individualmente
  useEffect(() => {
    localStorage.setItem('pontosA', JSON.stringify(pontosA));
  }, [pontosA]);

  useEffect(() => {
    localStorage.setItem('pontosB', JSON.stringify(pontosB));
  }, [pontosB]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedJogadoresA = localStorage.getItem('jogadoresA');
      const savedJogadoresB = localStorage.getItem('jogadoresB');
      const savedJogadoresBanco = localStorage.getItem('jogadoresBanco');
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

      if (savedJogadoresA) {
        const jogadoresAData = JSON.parse(savedJogadoresA);
        setJogadoresA(jogadoresAData.map((j: Jogador) => ({
          ...j,
          stamina: j.stamina || 100
        })));
      }

      if (savedJogadoresB) {
        const jogadoresBData = JSON.parse(savedJogadoresB);
        setJogadoresB(jogadoresBData.map((j: Jogador) => ({
          ...j,
          stamina: j.stamina || 100
        })));
      }

      if (savedJogadoresBanco) {
        const jogadoresBancoData = JSON.parse(savedJogadoresBanco);
        setJogadoresBanco(jogadoresBancoData.map((j: Jogador) => ({
          ...j,
          stamina: j.stamina || 100
        })));
      }

      if (savedHistoricoA) setHistoricoA(JSON.parse(savedHistoricoA));
      if (savedHistoricoB) setHistoricoB(JSON.parse(savedHistoricoB));
      if (savedFaltas) setFaltas(JSON.parse(savedFaltas));
      if (savedTimeAName) setTimeAName(savedTimeAName);
      if (savedTimeBName) setTimeBName(savedTimeBName);
      if (savedGames) {
        const gamesData = JSON.parse(savedGames);
        setGames(gamesData.map((game: Game) => ({
          ...game,
          jogadoresA: game.jogadoresA.map((j: Jogador) => ({
            ...j,
            stamina: j.stamina || 100
          })),
          jogadoresB: game.jogadoresB.map((j: Jogador) => ({
            ...j,
            stamina: j.stamina || 100
          })),
          jogadoresBanco: game.jogadoresBanco ? game.jogadoresBanco.map((j: Jogador) => ({
            ...j,
            stamina: j.stamina || 100
          })) : []
        })));
      }
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
    setJogadoresBanco([]);
    setHistoricoA([]);
    setHistoricoB([]);
    setPontosA(0);
    setPontosB(0);
    setTimeAName("Time A");
    setTimeBName("Time B");
    setSeconds(0); // Zera o timer
    setIsPaused(true);
    setFaltasA(0);
    setFaltasB(0);
    setFaltas([]);
    setPausas(0);
    setIsGameStarted(false);
    setPosseBola(null);
    setUltimaAtualizacaoPosse(null);
    setTempoInicio(null); // Zera tempo de início
    setTempoFim(null);   // Zera tempo de fim
    setAproveitamento({  // Zera médias
      mediaPontosJogador: '0',
      mediaPontosTimeA: '0',
      mediaPontosTimeB: '0'
    });

    // Limpar localStorage
    localStorage.removeItem('jogadoresA');
    localStorage.removeItem('jogadoresB');
    localStorage.removeItem('jogadoresBanco');
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
    localStorage.removeItem('tempoInicio');
    localStorage.removeItem('tempoFim');
  };

  // Função para importar dados
  const importarDados = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dados = JSON.parse(e.target?.result as string);
          if (!dados || typeof dados !== 'object') {
            throw new Error('Formato de arquivo inválido');
          }
          resetarTudo();
          if (Array.isArray(dados.jogadoresA)) setJogadoresA(dados.jogadoresA.map((j: Jogador) => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0) })));
          if (Array.isArray(dados.jogadoresB)) setJogadoresB(dados.jogadoresB.map((j: Jogador) => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0) })));
          if (Array.isArray(dados.jogadoresBanco)) setJogadoresBanco(dados.jogadoresBanco.map((j: Jogador) => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })));
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
          if (typeof dados.seconds === 'number') setSeconds(Math.floor(dados.seconds));
          if (typeof dados.isPaused === 'boolean') setIsPaused(dados.isPaused);
          if (Array.isArray(dados.games)) setGames(dados.games.map((game: Game) => ({
            ...game,
            tempoJogo: game.tempoJogo || 0,
            tempoInicio: game.tempoInicio || null,
            tempoFim: game.tempoFim || null,
            jogadoresA: game.jogadoresA.map((j: Jogador) => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })),
            jogadoresB: game.jogadoresB.map((j: Jogador) => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 }))
          })));
          if (typeof dados.tempoInicio === 'number') setTempoInicio(Math.floor(dados.tempoInicio));
          if (typeof dados.tempoFim === 'number') setTempoFim(Math.floor(dados.tempoFim));
          salvarEstado();
          alert('Dados importados com sucesso!');
        } catch (error) {
          console.error('Erro ao importar dados:', error);
          alert('Erro ao importar dados. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Função para salvar estado no localStorage
  const salvarEstado = () => {
    try {
      // Garantir que todos os jogadores tenham campos com valores padrão, se ausentes
      const jogadoresAEmSegundos = jogadoresA.map(j => ({
        ...j,
        tempoPosse: Math.floor(j.tempoPosse || 0),
        stamina: j.stamina || 100,
        pontos: j.pontos || 0,
        faltas: j.faltas || 0
      }));
      const jogadoresBEmSegundos = jogadoresB.map(j => ({
        ...j,
        tempoPosse: Math.floor(j.tempoPosse || 0),
        stamina: j.stamina || 100,
        pontos: j.pontos || 0,
        faltas: j.faltas || 0
      }));
      const jogadoresBancoEmSegundos = jogadoresBanco.map(j => ({
        ...j,
        tempoPosse: Math.floor(j.tempoPosse || 0),
        stamina: j.stamina || 100,
        pontos: j.pontos || 0,
        faltas: j.faltas || 0,
        time: null as null // Garantir que está marcado como banco
      }));
      const estado: EstadoJogo = {
        jogadoresA: jogadoresAEmSegundos,
        jogadoresB: jogadoresBEmSegundos,
        jogadoresBanco: jogadoresBancoEmSegundos,
        historicoA,
        historicoB,
        faltas,
        timeAName,
        timeBName,
        games,
        pausas,
        faltasA,
        faltasB,
        pontosA,
        pontosB,
        seconds: Math.floor(seconds),
        isPaused,
        isGameStarted,
        posseBola,
        ultimaAtualizacaoPosse,
        tempoInicio: tempoInicio ? Math.floor(tempoInicio) : null,
        tempoFim: tempoFim ? Math.floor(tempoFim) : null,
        aproveitamento: {
          mediaPontosJogador: ((+pontosA + +pontosB) / (jogadoresA.length + jogadoresB.length)).toFixed(1),
          mediaPontosTimeA: (+pontosA / jogadoresA.length).toFixed(1),
          mediaPontosTimeB: (+pontosB / jogadoresB.length).toFixed(1)
        }
      };
      localStorage.setItem('estadoJogo', JSON.stringify(estado));
      localStorage.setItem('jogadoresA', JSON.stringify(jogadoresAEmSegundos));
      localStorage.setItem('jogadoresB', JSON.stringify(jogadoresBEmSegundos));
      localStorage.setItem('jogadoresBanco', JSON.stringify(jogadoresBancoEmSegundos));
      localStorage.setItem('tempoInicio', tempoInicio ? Math.floor(tempoInicio).toString() : '');
      localStorage.setItem('tempoFim', tempoFim ? Math.floor(tempoFim).toString() : '');
      localStorage.setItem('pontosA', JSON.stringify(pontosA));
      localStorage.setItem('pontosB', JSON.stringify(pontosB));
      localStorage.setItem('seconds', JSON.stringify(Math.floor(seconds)));
      localStorage.setItem('isPaused', JSON.stringify(isPaused));
      localStorage.setItem('isGameStarted', JSON.stringify(isGameStarted));
      localStorage.setItem('games', JSON.stringify(games));
      console.log('Estado salvo com sucesso:', estado);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  };

  // Função para carregar estado do localStorage
  const carregarEstado = () => {
    try {
      const estadoSalvo = localStorage.getItem('estadoJogo');
      const jogadoresBancoSalvos = localStorage.getItem('jogadoresBanco');
      const pontosASalvos = localStorage.getItem('pontosA');
      const pontosBSalvos = localStorage.getItem('pontosB');
      const gamesSalvos = localStorage.getItem('games');
      const isPausedSalvo = localStorage.getItem('isPaused');
      const isGameStartedSalvo = localStorage.getItem('isGameStarted');

      // Carregar pontos das equipes
      if (pontosASalvos) {
        setPontosA(JSON.parse(pontosASalvos));
      }

      if (pontosBSalvos) {
        setPontosB(JSON.parse(pontosBSalvos));
      }

      // Carregar estado de jogo
      if (isPausedSalvo) {
        setIsPaused(JSON.parse(isPausedSalvo));
      }

      if (isGameStartedSalvo) {
        setIsGameStarted(JSON.parse(isGameStartedSalvo));
      }

      // Carregar jogos salvos
      if (gamesSalvos) {
        const parsedGames = JSON.parse(gamesSalvos);
        setGames(parsedGames.map((game: Game) => ({
          ...game,
          jogadoresA: game.jogadoresA.map((j: Jogador) => ({
            ...j,
            pontos: j.pontos || 0,
            faltas: j.faltas || 0,
            stamina: j.stamina || 100
          })),
          jogadoresB: game.jogadoresB.map((j: Jogador) => ({
            ...j,
            pontos: j.pontos || 0,
            faltas: j.faltas || 0,
            stamina: j.stamina || 100
          })),
          jogadoresBanco: game.jogadoresBanco ? game.jogadoresBanco.map((j: Jogador) => ({
            ...j,
            pontos: j.pontos || 0,
            faltas: j.faltas || 0,
            stamina: j.stamina || 100,
            time: null as null
          })) : []
        })));
      }

      if (jogadoresBancoSalvos) {
        const jogadoresBancoCarregados = JSON.parse(jogadoresBancoSalvos);
        setJogadoresBanco(jogadoresBancoCarregados.map((j: Jogador) => ({
          ...j,
          stamina: j.stamina || 100,
          pontos: j.pontos || 0,
          faltas: j.faltas || 0,
          time: null as null
        })));
      }

      if (estadoSalvo) {
        const estado: EstadoJogo = JSON.parse(estadoSalvo);
        console.log('Estado carregado:', estado);

        // Carregar todos os estados
        if (Array.isArray(estado.jogadoresA)) {
          setJogadoresA(estado.jogadoresA.map((j: Jogador) => ({
            ...j,
            pontos: j.pontos || 0,
            faltas: j.faltas || 0,
            stamina: j.stamina || 100
          })));
        }

        if (Array.isArray(estado.jogadoresB)) {
          setJogadoresB(estado.jogadoresB.map((j: Jogador) => ({
            ...j,
            pontos: j.pontos || 0,
            faltas: j.faltas || 0,
            stamina: j.stamina || 100
          })));
        }

        if (Array.isArray(estado.jogadoresBanco)) {
          setJogadoresBanco(estado.jogadoresBanco.map((j: Jogador) => ({
            ...j,
            pontos: j.pontos || 0,
            faltas: j.faltas || 0,
            stamina: j.stamina || 100,
            time: null as null
          })));
        }

        if (Array.isArray(estado.historicoA)) setHistoricoA(estado.historicoA);
        if (Array.isArray(estado.historicoB)) setHistoricoB(estado.historicoB);
        if (Array.isArray(estado.faltas)) setFaltas(estado.faltas);
        if (typeof estado.timeAName === 'string') setTimeAName(estado.timeAName);
        if (typeof estado.timeBName === 'string') setTimeBName(estado.timeBName);
        if (Array.isArray(estado.games)) setGames(estado.games);
        if (typeof estado.pausas === 'number') setPausas(estado.pausas);
        if (typeof estado.faltasA === 'number') setFaltasA(estado.faltasA);
        if (typeof estado.faltasB === 'number') setFaltasB(estado.faltasB);
        if (typeof estado.pontosA === 'number' || typeof estado.pontosA === 'string') setPontosA(estado.pontosA);
        if (typeof estado.pontosB === 'number' || typeof estado.pontosB === 'string') setPontosB(estado.pontosB);
        if (typeof estado.seconds === 'number') setSeconds(estado.seconds);
        if (typeof estado.isPaused === 'boolean') setIsPaused(estado.isPaused);
        if (typeof estado.isGameStarted === 'boolean') setIsGameStarted(estado.isGameStarted);
        if (estado.posseBola) setPosseBola(estado.posseBola);
        if (typeof estado.ultimaAtualizacaoPosse === 'number') setUltimaAtualizacaoPosse(estado.ultimaAtualizacaoPosse);
        if (typeof estado.tempoInicio === 'number') setTempoInicio(estado.tempoInicio);
        if (typeof estado.tempoFim === 'number') setTempoFim(estado.tempoFim);
        if (estado.aproveitamento) {
          setAproveitamento(estado.aproveitamento);
        }
      } else {
        // Tentar carregar tempoInicio e tempoFim separadamente se existirem
        const tInicio = localStorage.getItem('tempoInicio');
        const tFim = localStorage.getItem('tempoFim');
        if (tInicio) setTempoInicio(Number(tInicio));
        if (tFim) setTempoFim(Number(tFim));
      }
    } catch (error) {
      console.error('Erro ao carregar estado:', error);
      resetarTudo();
    }
  };

  // Função para calcular o tempo total de jogo em segundos
  const calcularTempoJogo = () => {
    if (!tempoInicio) return 0;
    if (tempoFim) return (tempoFim - tempoInicio) / 1000; // Converter para segundos
    return (Date.now() - tempoInicio) / 1000; // Converter para segundos
  };

  // Função para calcular eficiência do jogador
  const calcularEficiencia = (jogador: Jogador) => {
    // Se o jogador não está associado a nenhum time, retornar 0
    if (jogador.time === null) return 0;

    const cestas = jogador.time === 'A'
      ? historicoA.filter(p => p.jogadorId === jogador.id)
      : historicoB.filter(p => p.jogadorId === jogador.id);

    const pontos = cestas.reduce((sum, p) => sum + p.pontos, 0);
    const faltas = jogador.faltas || 0;
    const tempoPosse = jogador.tempoPosse || 0;

    // Calcular eficiência base: pontos por minuto de posse
    const eficienciaBase = pontos / (tempoPosse / 60 || 1); // Evitar divisão por zero

    // Penalizar faltas: subtrair 2 pontos por falta
    const penalidadeFaltas = faltas * 2;

    // Eficiência final: eficiência base menos penalidade de faltas
    const eficiencia = eficienciaBase - penalidadeFaltas;

    // Retornar 0 se a eficiência for negativa
    return Math.max(0, eficiencia);
  };

  // Função para calcular jogador mais decisivo
  const getJogadorMaisDecisivo = () => {
    const todosJogadores = [...jogadoresA, ...jogadoresB];
    const tempoDecorrido = calcularTempoJogo() / 1000; // Converter para segundos
    const ultimos5Minutos = Math.max(0, tempoDecorrido - 300); // 300 segundos = 5 minutos

    return todosJogadores.reduce((maisDecisivo, jogador) => {
      // Ignorar jogadores sem time
      if (jogador.time === null) return maisDecisivo;

      const pontosUltimos5Min = jogador.time === 'A'
        ? historicoA
          .filter(p => p.jogadorId === jogador.id)
          .filter(p => {
            const [min, sec] = p.tempo.split(':').map(Number);
            const tempoPonto = min * 60 + sec;
            return tempoPonto >= ultimos5Minutos;
          })
          .reduce((sum, p) => sum + p.pontos, 0)
        : historicoB
          .filter(p => p.jogadorId === jogador.id)
          .filter(p => {
            const [min, sec] = p.tempo.split(':').map(Number);
            const tempoPonto = min * 60 + sec;
            return tempoPonto >= ultimos5Minutos;
          })
          .reduce((sum, p) => sum + p.pontos, 0);

      if (pontosUltimos5Min > (maisDecisivo?.pontos || 0)) {
        return { ...jogador, pontos: pontosUltimos5Min };
      }
      return maisDecisivo;
    }, null as (Jogador & { pontos: number }) | null);
  };

  // Função para salvar game atual
  const salvarGame = () => {
    const tempoJogo = calcularTempoJogo(); // Em segundos
    const novoGame: Game = {
      id: Date.now().toString(),
      timeAName,
      timeBName,
      pontosA: +pontosA,
      pontosB: +pontosB,
      jogadoresA: jogadoresA.map(j => ({
        ...j,
        eficiencia: calcularEficiencia(j)
      })),
      jogadoresB: jogadoresB.map(j => ({
        ...j,
        eficiencia: calcularEficiencia(j)
      })),
      historicoA,
      historicoB,
      faltas,
      data: new Date().toLocaleString(),
      pausas,
      faltasA,
      faltasB,
      seconds,
      isPaused,
      isGameStarted,
      posseBola,
      ultimaAtualizacaoPosse,
      tempoInicio,
      tempoFim,
      tempoJogo
    };
    setGames([...games, novoGame]);
    salvarEstado();
  };

  // Função para carregar um game salvo
  const carregarGame = (game: Game) => {
    setTimeAName(game.timeAName);
    setTimeBName(game.timeBName);
    setPontosA(game.pontosA.toString());
    setPontosB(game.pontosB.toString());

    // Garantir que os jogadores tenham todos os campos necessários
    setJogadoresA(game.jogadoresA.map(j => ({
      ...j,
      pontos: j.pontos || 0,
      faltas: j.faltas || 0,
      stamina: j.stamina || 100
    })));

    setJogadoresB(game.jogadoresB.map(j => ({
      ...j,
      pontos: j.pontos || 0,
      faltas: j.faltas || 0,
      stamina: j.stamina || 100
    })));

    // Garantir que jogadores do banco também tenham valores padrão
    if (game.jogadoresBanco && game.jogadoresBanco.length > 0) {
      setJogadoresBanco(game.jogadoresBanco.map(j => ({
        ...j,
        pontos: j.pontos || 0,
        faltas: j.faltas || 0,
        stamina: j.stamina || 100,
        time: null as null // Garantir que está no banco
      })));
    }

    setHistoricoA(game.historicoA);
    setHistoricoB(game.historicoB);
    setFaltas(game.faltas);
    setFaltasA(game.faltas.filter(f => f.time === 'A').length);
    setFaltasB(game.faltas.filter(f => f.time === 'B').length);
    setPausas(game.pausas);

    // Atualizar aproveitamento
    const novoAproveitamento: EstadoJogo['aproveitamento'] = {
      mediaPontosJogador: ((game.pontosA + game.pontosB) / (game.jogadoresA.length + game.jogadoresB.length)).toFixed(1),
      mediaPontosTimeA: (game.pontosA / game.jogadoresA.length).toFixed(1),
      mediaPontosTimeB: (game.pontosB / game.jogadoresB.length).toFixed(1)
    };
    setAproveitamento(novoAproveitamento);

    // Salvar no localStorage para persistência
    localStorage.setItem('pontosA', game.pontosA.toString());
    localStorage.setItem('pontosB', game.pontosB.toString());

    setShowGamesModal(false);

    // Garantir que o estado atualizado seja salvo
    setTimeout(() => {
      salvarEstado();
    }, 300);
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
    const tempoJogo = calcularTempoJogo(); // Em segundos
    const dados = {
      games: games.map(game => ({
        ...game,
        tempoJogo: game.tempoJogo || 0,
        tempoInicio: game.tempoInicio || null,
        tempoFim: game.tempoFim || null,
        jogadoresA: game.jogadoresA.map(j => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })),
        jogadoresB: game.jogadoresB.map(j => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })),
        jogadoresBanco: game.jogadoresBanco || []
      })),
      jogadoresA: jogadoresA.map(j => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })),
      jogadoresB: jogadoresB.map(j => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })),
      jogadoresBanco: jogadoresBanco.map(j => ({ ...j, tempoPosse: Math.floor(j.tempoPosse || 0), stamina: j.stamina || 100 })),
      historicoA,
      historicoB,
      faltas,
      timeAName,
      timeBName,
      pausas,
      faltasA,
      faltasB,
      dataExportacao: new Date().toLocaleString(),
      tempoJogoAtual: Math.floor(tempoJogo),
      tempoInicio: tempoInicio ? Math.floor(tempoInicio) : null,
      tempoFim: tempoFim ? Math.floor(tempoFim) : null
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
    // Se o jogador não tem time, retornar valores vazios
    if (jogador.time === null) {
      return {
        pontos: [],
        faltas: [],
        totalPontos: 0,
        totalFaltas: 0,
        tempoPosse: jogador.tempoPosse || 0
      };
    }

    const pontos = jogador.time === 'A'
      ? historicoA.filter(p => p.jogadorId === jogador.id)
      : historicoB.filter(p => p.jogadorId === jogador.id);

    const jogadorFaltas = faltas.filter((f: Falta) => f.jogadorId === jogador.id && f.time === jogador.time);

    // Encontrar o jogador atual na lista correta
    const jogadorAtual = jogador.time === 'A'
      ? jogadoresA.find(j => j.id === jogador.id)
      : jogadoresB.find(j => j.id === jogador.id);

    return {
      pontos,
      faltas: jogadorFaltas,
      totalPontos: pontos.reduce((sum, p) => sum + p.pontos, 0),
      totalFaltas: jogadorFaltas.length,
      tempoPosse: jogadorAtual?.tempoPosse || jogador.tempoPosse || 0
    };
  };

  // Função para mostrar detalhes do jogador
  const showPlayerInfo = (jogador: Jogador) => {
    setSelectedPlayer(jogador);
    setShowPlayerDetails(true);
  };

  // Função para calcular estatísticas do jogo
  const getGameStats = (): GameStats => {
    // Combinar todos os jogadores
    const todosJogadores = [...jogadoresA, ...jogadoresB];

    // Calcular jogador mais eficiente
    const jogadorMaisEficiente = todosJogadores.reduce((maisEficiente, jogador) => {
      const eficienciaAtual = calcularEficiencia(jogador);
      if (!maisEficiente || eficienciaAtual > calcularEficiencia(maisEficiente)) {
        return jogador;
      }
      return maisEficiente;
    }, null as Jogador | null);

    // Calcular jogador mais decisivo
    const jogadorMaisDecisivo = getJogadorMaisDecisivo();

    // Calcular maior sequência de pontos por jogador
    const sequenciasJogadores = todosJogadores
      .filter(jogador => jogador.time === 'A' || jogador.time === 'B') // Filtrar apenas jogadores com time válido
      .map(jogador => {
        let sequenciaAtual = 0;
        let maiorSequencia = 0;

        const historico = jogador.time === 'A' ? historicoA : historicoB;
        historico
          .filter(p => p.jogadorId === jogador.id)
          .sort((a, b) => {
            const [minA, secA] = a.tempo.split(':').map(Number);
            const [minB, secB] = b.tempo.split(':').map(Number);
            return (minB * 60 + secB) - (minA * 60 + secA);
          })
          .forEach(evento => {
            sequenciaAtual++;
            maiorSequencia = Math.max(maiorSequencia, sequenciaAtual);
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

    const historicoCombinado = [...historicoA.map(p => ({ ...p, time: 'A' as const })), ...historicoB.map(p => ({ ...p, time: 'B' as const }))].sort((a, b) => {
      const [minA, secA] = a.tempo.split(':').map(Number);
      const [minB, secB] = b.tempo.split(':').map(Number);
      return (minB * 60 + secB) - (minA * 60 + secA);
    });

    historicoCombinado.forEach(evento => {
      if (evento.time === 'A') {
        sequenciaAtualA++;
        sequenciaAtualB = 0;
        sequenciasTimes[0].sequencia = Math.max(sequenciasTimes[0].sequencia, sequenciaAtualA);
      } else {
        sequenciaAtualB++;
        sequenciaAtualA = 0;
        sequenciasTimes[1].sequencia = Math.max(sequenciasTimes[1].sequencia, sequenciaAtualB);
      }
    });

    return {
      jogadorMaisEficiente,
      jogadorMaisDecisivo,
      maiorSequenciaPontos: sequenciasJogadores
        .sort((a, b) => b.sequencia - a.sequencia)[0] || null,
      maiorSequenciaTime: sequenciasTimes
        .sort((a, b) => b.sequencia - a.sequencia)[0] || null,
      jogadorMaisFaltoso: todosJogadores
        .sort((a, b) => b.faltas - a.faltas)[0] || null,
      jogadorMaisParticipativo: todosJogadores
        .sort((a, b) => (b.pontos + b.faltas) - (a.pontos + a.faltas))[0] || null,
      jogadorMaisTempoSemFalta: todosJogadores
        .sort((a, b) => (b.tempoPosse || 0) - (a.tempoPosse || 0))[0] || null
    };
  };

  // Função para lidar com o toque e segurar no jogador
  const handleTouchStart = (jogador: Jogador) => {
    if (jogador.time === null) return; // Ignorar jogadores sem time
    
    // Verificar se é o mesmo jogador que já tem a posse
    if (posseBola && posseBola.jogadorId === jogador.id) {
      // Se o mesmo jogador já tem a posse, remover a posse
      removerPosseBola();
      return;
    }
    
    // Se já havia um jogador com posse, registrar o tempo de posse do jogador anterior
    if (posseBola) {
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
    }
    
    // Definir novo jogador com a posse
    setPosseBola({ time: jogador.time as 'A' | 'B', jogadorId: jogador.id });
    setUltimaAtualizacaoPosse(Date.now());
    
    // Salvar estado para garantir persistência
    setTimeout(() => {
      salvarEstado();
    }, 300);
  };

  // Função para remover a posse da bola
  const removerPosseBola = () => {
    // Se já havia um jogador com posse, registrar o tempo de posse final
    if (posseBola) {
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
    }
    
    // Limpar a posse
    setPosseBola(null);
    setUltimaAtualizacaoPosse(null);
    
    // Salvar estado
    setTimeout(() => {
      salvarEstado();
    }, 300);
  };

  const handleTouchEnd = () => {
    // Não desativamos mais a posse ao soltar, ela permanece ativa
    // até que outro jogador seja clicado ou a posse seja removida explicitamente
  };

  // Atualizar tempo de posse
  useEffect(() => {
    // Só contar tempo de posse se:
    // 1. Tem posseBola definida (não é null)
    // 2. O jogadorId é maior que 0 (evita problemas com ID 0)
    // 3. O jogo não está pausado
    if (posseBola && posseBola.jogadorId > 0 && !isPaused) {
      const intervalId = setInterval(() => {
        const agora = Date.now();
        if (ultimaAtualizacaoPosse) {
          const tempoDecorrido = (agora - ultimaAtualizacaoPosse) / 1000; // Converter para segundos

          if (posseBola.time === 'A') {
            // Verificar se o jogador existe no time A
            const jogadorExiste = jogadoresA.some(j => j.id === posseBola.jogadorId);
            if (jogadorExiste) {
              setJogadoresA(jogadoresA.map(j =>
                j.id === posseBola.jogadorId
                  ? { ...j, tempoPosse: (j.tempoPosse || 0) + tempoDecorrido }
                  : j
              ));
            } else {
              // Se o jogador não existe mais, remover a posse
              removerPosseBola();
            }
          } else if (posseBola.time === 'B') {
            // Verificar se o jogador existe no time B
            const jogadorExiste = jogadoresB.some(j => j.id === posseBola.jogadorId);
            if (jogadorExiste) {
              setJogadoresB(jogadoresB.map(j =>
                j.id === posseBola.jogadorId
                  ? { ...j, tempoPosse: (j.tempoPosse || 0) + tempoDecorrido }
                  : j
              ));
            } else {
              // Se o jogador não existe mais, remover a posse
              removerPosseBola();
            }
          }
          setUltimaAtualizacaoPosse(agora);
        }
      }, 1000); // Atualizar a cada segundo para maior precisão
      
      return () => clearInterval(intervalId);
    }
  }, [posseBola, isPaused, jogadoresA, jogadoresB, ultimaAtualizacaoPosse]);

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
      if (!tempoInicio) {
        setTempoInicio(Date.now()); // Salva apenas no primeiro play
      }
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
      id: Date.now(), // Usar timestamp para garantir ID único
      nome: newPlayerName.trim(),
      pontos: 0,
      faltas: 0,
      time: teamToAddPlayer,
      tempoPosse: 0,
      stamina: 100
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
        if (seconds === 1) {
          if (!tempoFim) {
            setTempoFim(Date.now()); // Salva apenas quando chega a zero
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPaused, seconds, tempoFim]);

  // Função para formatar o tempo em MM:SS ou apenas segundos
  const formatarTempo = (segundos: number) => {
    const segundosInteiro = Math.floor(segundos);
    if (segundosInteiro < 60) {
      return `${segundosInteiro}s`;
    }
    const minutos = Math.floor(segundosInteiro / 60);
    const segundosRestantes = segundosInteiro % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  // Atualizar useEffect para salvar estado
  useEffect(() => {
    const salvarEstadoComTimeout = setTimeout(() => {
      salvarEstado();
    }, 1000); // Salvar após 1 segundo de inatividade

    return () => clearTimeout(salvarEstadoComTimeout);
  }, [
    jogadoresA, jogadoresB, historicoA, historicoB, faltas,
    timeAName, timeBName, games, pausas, faltasA, faltasB,
    pontosA, pontosB, seconds, isPaused, isGameStarted,
    posseBola, ultimaAtualizacaoPosse,
    tempoInicio, tempoFim
  ]);

  // Carregar estado ao iniciar
  useEffect(() => {
    carregarEstado();
  }, []);

  // Atualizar médias sempre que pontos ou jogadores mudarem
  useEffect(() => {
    const totalJogadores = jogadoresA.length + jogadoresB.length;
    const mediaPontosJogador = totalJogadores > 0 ? ((+pontosA + +pontosB) / totalJogadores).toFixed(1) : '0';
    const mediaPontosTimeA = jogadoresA.length > 0 ? (+pontosA / jogadoresA.length).toFixed(1) : '0';
    const mediaPontosTimeB = jogadoresB.length > 0 ? (+pontosB / jogadoresB.length).toFixed(1) : '0';
    const novoAproveitamento = {
      mediaPontosJogador,
      mediaPontosTimeA,
      mediaPontosTimeB
    };
    setAproveitamento(novoAproveitamento);
    // Salvar no localStorage também
    const estadoSalvo = localStorage.getItem('estadoJogo');
    if (estadoSalvo) {
      const estado = JSON.parse(estadoSalvo);
      estado.aproveitamento = novoAproveitamento;
      localStorage.setItem('estadoJogo', JSON.stringify(estado));
    }
  }, [pontosA, pontosB, jogadoresA, jogadoresB]);

  // Função para adicionar jogador ao banco
  const adicionarJogadorAoBanco = () => {
    if (!newPlayerName.trim()) return;

    const novoJogador: Jogador = {
      id: Date.now(), // Usar timestamp para garantir ID único
      nome: newPlayerName.trim(),
      pontos: 0,
      faltas: 0,
      time: null as null,
      tempoPosse: 0,
      stamina: 100, // Sempre começar com estamina cheia
      historicoTimes: [] // Iniciar com histórico vazio
    };

    setJogadoresBanco([...jogadoresBanco, novoJogador]);
    setShowAddBenchPlayerPopover(false);
    setNewPlayerName('');

    // Salvar estado imediatamente para não perder o jogador
    setTimeout(() => {
      salvarEstado();
    }, 300);
  };

  // Função para mover jogador do banco para um time
  const adicionarAoTime = (jogador: Jogador, time: 'A' | 'B') => {
    // Verificar se o jogador já jogou nesse time antes
    const historico = jogador.historicoTimes || [];
    const ultimoTime = jogador.time;
    let historicoAtualizado = [...historico];

    // Se o jogador já estava em um time, guardar seus dados naquele time
    if (ultimoTime === 'A' || ultimoTime === 'B') {
      const pontosSalvos = jogador.pontos;
      const faltasSalvos = jogador.faltas;

      // Adicionar ao histórico
      historicoAtualizado.push({
        time: ultimoTime,
        pontos: pontosSalvos,
        faltas: faltasSalvos
      });
    }

    // Não manipular a stamina aqui, ela só deve mudar com o tempo de jogo
    // Atualizar o jogador com seu novo time, mantendo pontos, faltas e stamina
    const jogadorAtualizado: Jogador = {
      ...jogador,
      id: Date.now(), // Gerar um novo ID único baseado em timestamp
      time: time,
      historicoTimes: historicoAtualizado
      // Mantém stamina, pontos e faltas do jogador
    };

    // Remover jogador do banco
    setJogadoresBanco(jogadoresBanco.filter(j => j.id !== jogador.id));

    // Adicionar ao time correspondente
    if (time === 'A') {
      setJogadoresA([...jogadoresA, jogadorAtualizado]);
    } else {
      setJogadoresB([...jogadoresB, jogadorAtualizado]);
    }
  };

  // Função para retornar jogador ao banco
  const voltarParaBanco = (jogador: Jogador) => {
    const time = jogador.time;

    // Se o jogador não tem time, não fazer nada
    if (time !== 'A' && time !== 'B') return;

    // Guardar histórico antes de voltar para o banco
    const historico = jogador.historicoTimes || [];
    const historicoAtualizado = [...historico, {
      time,
      pontos: jogador.pontos,
      faltas: jogador.faltas
    }];

    // Não manipular a stamina aqui, ela só deve mudar com o tempo de jogo
    // Atualizar o jogador para o banco, mantendo todas as estatísticas
    const jogadorAtualizado: Jogador = {
      ...jogador,
      id: Date.now(), // Gerar um novo ID único baseado em timestamp
      time: null as null,
      historicoTimes: historicoAtualizado
      // Mantém stamina, pontos e faltas do jogador
    };

    // Remover do time atual
    if (time === 'A') {
      setJogadoresA(jogadoresA.filter(j => j.id !== jogador.id));
    } else {
      setJogadoresB(jogadoresB.filter(j => j.id !== jogador.id));
    }

    // Adicionar ao banco
    setJogadoresBanco([...jogadoresBanco, jogadorAtualizado]);
  };

  // Atualizar efeito para reduzir stamina apenas durante o jogo em andamento
  useEffect(() => {
    if (!isPaused && isGameStarted) {
      const intervalId = setInterval(() => {
        // Reduzir stamina de jogadores que estão em times A
        setJogadoresA(prevJogadores => {
          return prevJogadores.map(j => {
            // Verificar se este jogador tem a posse da bola
            // Só considerar a posse se o jogadorId for maior que 0 e o time for A
            const temPosseBola = posseBola && 
                                posseBola.jogadorId > 0 && 
                                posseBola.jogadorId === j.id && 
                                posseBola.time === 'A';
            
            // Calcular a nova stamina
            const taxaReducao = temPosseBola ? 2.0 : 0.5; // Dobrar a taxa para quem tem a bola
            const novaStamina = Math.max(10, (j.stamina || 100) - taxaReducao);
            
            return {
              ...j,
              stamina: novaStamina
            };
          });
        });
        
        // Reduzir stamina de jogadores que estão em times B
        setJogadoresB(prevJogadores => {
          return prevJogadores.map(j => {
            // Verificar se este jogador tem a posse da bola
            // Só considerar a posse se o jogadorId for maior que 0 e o time for B
            const temPosseBola = posseBola && 
                                posseBola.jogadorId > 0 && 
                                posseBola.jogadorId === j.id && 
                                posseBola.time === 'B';
            
            // Calcular a nova stamina
            const taxaReducao = temPosseBola ? 2.0 : 0.5; // Dobrar a taxa para quem tem a bola
            const novaStamina = Math.max(10, (j.stamina || 100) - taxaReducao);
            
            return {
              ...j,
              stamina: novaStamina
            };
          });
        });
      }, 2000); // Reduzir para 2 segundos para tornar o efeito mais perceptível
      
      return () => clearInterval(intervalId);
    }
  }, [isPaused, isGameStarted, posseBola]);

  // Novo useEffect para recuperar stamina dos jogadores no banco independente do estado do jogo
  useEffect(() => {
    const bancoIntervalId = setInterval(() => {
      // Recuperar stamina dos jogadores no banco (2x mais rápido) mesmo com jogo pausado
      if (jogadoresBanco.length > 0) {
        setJogadoresBanco(jogadoresBanco.map(j => ({
          ...j,
          stamina: Math.min(100, (j.stamina || 100) + 0.8)
        })));
      }
    }, 3000); // A cada 3 segundos

    return () => clearInterval(bancoIntervalId);
  }, [jogadoresBanco, setJogadoresBanco]);

  // Função para abrir o popover de adicionar jogador ao banco
  const openAddBenchPlayerPopover = () => {
    setNewPlayerName('');
    setShowAddBenchPlayerPopover(true);
  };

  // Função para abrir o modal de falta
  const abrirModalFalta = (time: 'A' | 'B') => {
    setSelectedFaltaTeam(time);
    setShowFaltaModal(true);
  };

  // Função para iniciar o processo de remoção de um jogador (mostra confirmação)
  const iniciarRemocaoJogador = (jogador: Jogador) => {
    setJogadorParaRemover(jogador);
    setShowRemoveConfirmation(true);
  };
  
  // Função para remover um jogador completamente do jogo
  const removerJogador = () => {
    if (!jogadorParaRemover) return;
    
    const jogador = jogadorParaRemover;
    
    // Verificar de onde remover o jogador (time A, time B ou banco)
    if (jogador.time === 'A') {
      setJogadoresA(jogadoresA.filter(j => j.id !== jogador.id));
    } else if (jogador.time === 'B') {
      setJogadoresB(jogadoresB.filter(j => j.id !== jogador.id));
    } else {
      setJogadoresBanco(jogadoresBanco.filter(j => j.id !== jogador.id));
    }
    
    // Também remover quaisquer pontos e faltas associados
    setHistoricoA(historicoA.filter(p => p.jogadorId !== jogador.id));
    setHistoricoB(historicoB.filter(p => p.jogadorId !== jogador.id));
    setFaltas(faltas.filter(f => f.jogadorId !== jogador.id));
    
    // Se o jogador tinha posse de bola, resetar
    if (posseBola && posseBola.jogadorId === jogador.id) {
      setPosseBola(null);
    }
    
    // Fechar o modal de confirmação
    setShowRemoveConfirmation(false);
    setJogadorParaRemover(null);
    
    // Salvar estado após a remoção
    setTimeout(() => {
      salvarEstado();
    }, 300);
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
              <div className='flex flex-col pt-10 items-center justify-center w-full'>
                <div className="flex flex-col gap-4 mb-4">

                  {/* Botões de controle */}
                  <div className="flex flex-col items-center mx-4">
                    <AiFillPauseCircle size={120} onClick={handleTimerToggle} />
                    <GiWhistle onClick={StartSound} size={80} className="mt-4" />
                    {/* Botão para remover posse da bola */}
                    {posseBola && (
                      <button 
                        className="mt-4 p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
                        onClick={removerPosseBola}
                      >
                        Remover Posse da Bola
                      </button>
                    )}
                  </div>

                  <div className='w-full flex '>
                    {/* Boxes dos jogadores do Time A */}
                    <div className="flex flex-col gap-2 w-full">
                      {/* Cards dos jogadores do Time A durante o jogo */}
                      {jogadoresA.map((jogador) => {
                        // Verificar se este jogador tem a posse da bola
                        const temPosseBola = posseBola && posseBola.jogadorId > 0 && posseBola.jogadorId === jogador.id && posseBola.time === 'A';
                        
                        return (
                          <div
                            key={`jogo-timeA-${jogador.id}`}
                            className={`p-3 rounded cursor-pointer transition-all w-44 ${
                              temPosseBola
                                ? 'bg-white text-zinc-900 border-2 border-zinc-800 shadow-lg'
                                : 'bg-zinc-800'
                            }`}
                            onClick={() => handleTouchStart(jogador)}
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-bold">{jogador.nome}</p>
                              <span className="text-xs px-1 py-0.5 rounded bg-red-600 text-white">{jogador.faltas}</span>
                            </div>
                            <p className="text-sm font-bold mt-1">{jogador.pontos} pts</p>
                            
                            {/* Barra de stamina */}
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                              <div 
                                className={`h-full ${jogador.stamina > 70 ? 'bg-green-500' :
                                  jogador.stamina > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${jogador.stamina || 100}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Estamina: {(Number(jogador.stamina ?? 100)).toFixed(0)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Boxes dos jogadores do Time B */}
                    <div className="flex flex-col gap-2 w-full">
                      {jogadoresB.map((jogador) => {
                        // Verificar se este jogador tem a posse da bola
                        const temPosseBola = posseBola && posseBola.jogadorId > 0 && posseBola.jogadorId === jogador.id && posseBola.time === 'B';
                        
                        return (
                          <div
                            key={`jogo-timeB-${jogador.id}`}
                            className={`p-3 rounded cursor-pointer transition-all w-44 ${
                              temPosseBola
                                ? 'bg-white text-zinc-900 border-2 border-zinc-800 shadow-lg'
                                : 'bg-zinc-800'
                            }`}
                            onClick={() => handleTouchStart(jogador)}
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-bold">{jogador.nome}</p>
                              <span className="text-xs px-1 py-0.5 rounded bg-red-600 text-white">{jogador.faltas}</span>
                            </div>
                            <p className="text-sm font-bold mt-1">{jogador.pontos} pts</p>
                            
                            {/* Indicador de posse de bola */}
                            
                            {/* Barra de stamina */}
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                              <div 
                                className={`h-full ${jogador.stamina > 70 ? 'bg-green-500' :
                                  jogador.stamina > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${jogador.stamina || 100}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Estamina: {(Number(jogador.stamina ?? 100)).toFixed(0)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                      key={`popover-${selectedTeam}-${jogador.id}`}
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
                    const cestas3pts = stats.pontos.filter(p => p.pontos === 3).length;
                    const cestas2pts = stats.pontos.filter(p => p.pontos === 2).length;
                    const lancesLivres = stats.pontos.filter(p => p.pontos === 1).length;
                    return (
                      <div
                        key={`stats-timeA-${jogador.id}`}
                        className="bg-zinc-800 p-4 rounded-lg cursor-pointer hover:bg-zinc-700"
                        onClick={() => showPlayerInfo(jogador)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-bold">{jogador.nome}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-yellow-500">3pts:</span>
                                <span className="text-sm">{cestas3pts} cestas ({cestas3pts * 3} pts)</span>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-yellow-500">2pts:</span>
                                <span className="text-sm">{cestas2pts} cestas ({cestas2pts * 2} pts)</span>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-yellow-500">1pt:</span>
                                <span className="text-sm">{lancesLivres} lances ({lancesLivres} pts)</span>
                              </div>
                            </div>
                            {stats.totalFaltas > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <GiCardPlay className="text-red-500" size={20} />
                                <span className="text-sm text-red-400">{stats.totalFaltas} falta{stats.totalFaltas > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            <div className="mt-2">
                              <span className="text-sm text-zinc-400">Posse: {formatarTempo(jogador.tempoPosse || 0)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-500">{stats.totalPontos} pts</p>
                            <p className="text-sm text-zinc-400">
                              Eficiência: {calcularEficiencia(jogador).toFixed(1)}
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
                    const cestas3pts = stats.pontos.filter(p => p.pontos === 3).length;
                    const cestas2pts = stats.pontos.filter(p => p.pontos === 2).length;
                    const lancesLivres = stats.pontos.filter(p => p.pontos === 1).length;
                    return (
                      <div
                        key={`stats-timeB-${jogador.id}`}
                        className="bg-zinc-800 p-4 rounded-lg cursor-pointer hover:bg-zinc-700"
                        onClick={() => showPlayerInfo(jogador)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-bold">{jogador.nome}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-yellow-500">3pts:</span>
                                <span className="text-sm">{cestas3pts} cestas ({cestas3pts * 3} pts)</span>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-yellow-500">2pts:</span>
                                <span className="text-sm">{cestas2pts} cestas ({cestas2pts * 2} pts)</span>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-yellow-500">1pt:</span>
                                <span className="text-sm">{lancesLivres} lances ({lancesLivres} pts)</span>
                              </div>
                            </div>
                            {stats.totalFaltas > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <GiCardPlay className="text-red-500" size={20} />
                                <span className="text-sm text-red-400">{stats.totalFaltas} falta{stats.totalFaltas > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            <div className="mt-2">
                              <span className="text-sm text-zinc-400">Posse: {formatarTempo(jogador.tempoPosse || 0)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-500">{stats.totalPontos} pts</p>
                            <p className="text-sm text-zinc-400">
                              Eficiência: {calcularEficiencia(jogador).toFixed(1)}
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
                  <div key={index} className={`bg-zinc-800 p-3 rounded w-full flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      {item.tipo === 'ponto' ? (
                        <>
                          <span className={`font-bold px-2 py-1 rounded ${item.pontos === 3 ? 'bg-yellow-500' : item.pontos === 2 ? 'bg-yellow-600' : 'bg-yellow-700'} text-black`}>
                            +{item.pontos}
                          </span>
                          <span className="font-medium">{item.jogador}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-500 font-bold px-2 py-1 rounded bg-red-500/20">
                            Falta
                          </span>
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
              <div className="bg-zinc-800 p-6 rounded-lg w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-zinc-800">
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
                        <span>Tempo de Posse:</span>
                        <span className="font-bold">{formatarTempo(selectedPlayer.tempoPosse || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pontos por Minuto:</span>
                        <span className="font-bold">
                          {((getPlayerStats(selectedPlayer).totalPontos / ((selectedPlayer.tempoPosse || 0) / 60)) || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Cálculo da Eficiência</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pontos por Minuto:</span>
                        <span className="font-bold text-yellow-500">
                          {((getPlayerStats(selectedPlayer).totalPontos / ((selectedPlayer.tempoPosse || 0) / 60)) || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Penalidade por Faltas:</span>
                        <span className="font-bold text-red-500">
                          -{(selectedPlayer.faltas || 0) * 2} pontos
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eficiência Final:</span>
                        <span className="font-bold">
                          {calcularEficiencia(selectedPlayer).toFixed(1)} pts/min
                        </span>
                      </div>
                      <div className="mt-4 text-sm text-zinc-400">
                        <p>Fórmula: (Pontos / Tempo de Posse em minutos) - (Faltas * 2)</p>
                        <p>Quanto mais pontos em menos tempo, maior a eficiência.</p>
                        <p>Cada falta reduz 2 pontos da eficiência.</p>
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
                  {aproveitamento?.mediaPontosJogador || ((+pontosA + +pontosB) / (jogadoresA.length + jogadoresB.length)).toFixed(1)}
                </p>
              </div>
              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Média de Pontos por Time</h4>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">{timeAName}</p>
                    <p className="text-xl font-bold text-red-500">
                      {aproveitamento?.mediaPontosTimeA || (+pontosA / jogadoresA.length).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">{timeBName}</p>
                    <p className="text-xl font-bold text-blue-500">
                      {aproveitamento?.mediaPontosTimeB || (+pontosB / jogadoresB.length).toFixed(1)}
                    </p>
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
                {(() => {
                  const jogadorMaisEficiente = getGameStats().jogadorMaisEficiente;
                  if (!jogadorMaisEficiente) return <></>;
                  const eficiencia = calcularEficiencia(jogadorMaisEficiente);
                  return (
                    <div>
                      <p className="text-lg font-bold">{jogadorMaisEficiente.nome}</p>
                      <p className="text-sm text-zinc-400">{eficiencia.toFixed(1)} pts/min</p>
                      <p className="text-sm text-zinc-400">
                        {jogadorMaisEficiente.pontos} pontos em {formatarTempo(jogadorMaisEficiente.tempoPosse || 0)}
                      </p>
                      {jogadorMaisEficiente.faltas > 0 && (
                        <p className="text-sm text-red-400">
                          {jogadorMaisEficiente.faltas} falta{jogadorMaisEficiente.faltas !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Jogador com Menos Faltas</h4>
                {(() => {
                  const todosJogadores = [...jogadoresA, ...jogadoresB];
                  const jogadorMenosFaltas = todosJogadores.reduce((menosFaltas, jogador) => {
                    if (!menosFaltas || jogador.faltas < menosFaltas.faltas) return jogador;
                    return menosFaltas;
                  }, null as Jogador | null);
                  if (!jogadorMenosFaltas) return <></>;
                  return (
                    <div>
                      <p className="text-lg font-bold">{jogadorMenosFaltas.nome}</p>
                      <p className="text-sm text-zinc-400">{jogadorMenosFaltas.faltas} falta{jogadorMenosFaltas.faltas !== 1 ? 's' : ''}</p>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Jogador com Mais Posse de Bola</h4>
                {(() => {
                  const todosJogadores = [...jogadoresA, ...jogadoresB];
                  const jogadorMaisPosse = todosJogadores.reduce((maisPosse, jogador) => {
                    if (!maisPosse || (jogador.tempoPosse || 0) > (maisPosse.tempoPosse || 0)) return jogador;
                    return maisPosse;
                  }, null as Jogador | null);
                  if (!jogadorMaisPosse) return <></>;
                  return (
                    <div>
                      <p className="text-lg font-bold">{jogadorMaisPosse.nome}</p>
                      <p className="text-sm text-zinc-400">{formatarTempo(jogadorMaisPosse.tempoPosse || 0)}</p>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Maior Cestinha de 3 Pontos</h4>
                {(() => {
                  const todosJogadores = [...jogadoresA, ...jogadoresB];
                  const jogadorMais3pts = todosJogadores.reduce((mais3pts, jogador) => {
                    const cestas3pts = jogador.time === 'A'
                      ? historicoA.filter(p => p.jogadorId === jogador.id && p.pontos === 3).length
                      : historicoB.filter(p => p.jogadorId === jogador.id && p.pontos === 3).length;
                    if (!mais3pts || cestas3pts > (mais3pts.cestas3pts || 0)) return { ...jogador, cestas3pts };
                    return mais3pts;
                  }, null as (Jogador & { cestas3pts: number }) | null);
                  if (!jogadorMais3pts) return <></>;
                  return (
                    <div>
                      <p className="text-lg font-bold">{jogadorMais3pts.nome}</p>
                      <p className="text-sm text-zinc-400">{jogadorMais3pts.cestas3pts} cestas de 3 pontos</p>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-zinc-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Maior Cestinha</h4>
                {(() => {
                  const todosJogadores = [...jogadoresA, ...jogadoresB];
                  const jogadorMaisPontos = todosJogadores.reduce((maisPontos, jogador) => {
                    if (!maisPontos || jogador.pontos > maisPontos.pontos) return jogador;
                    return maisPontos;
                  }, null as Jogador | null);
                  if (!jogadorMaisPontos) return <></>;
                  return (
                    <div>
                      <p className="text-lg font-bold">{jogadorMaisPontos.nome}</p>
                      <p className="text-sm text-zinc-400">{jogadorMaisPontos.pontos} pontos</p>
                    </div>
                  );
                })()}
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
                  {formatarTempo(calcularTempoJogo())}
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
                    <div key={`posse-timeA-${jogador.id}`} className="flex justify-between items-center">
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
                    <div key={`posse-timeB-${jogador.id}`} className="flex justify-between items-center">
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

      {/* Modal de falta */}
      {showFaltaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-4 rounded-lg w-80">
            <h3 className="text-xl font-bold mb-4">Registrar Falta</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  className={`flex-1 p-2 rounded ${selectedFaltaTeam === 'A' ? 'bg-red-500' : 'bg-zinc-700'}`}
                  onClick={() => setSelectedFaltaTeam('A')}
                >
                  {timeAName}
                </button>
                <button
                  className={`flex-1 p-2 rounded ${selectedFaltaTeam === 'B' ? 'bg-blue-500' : 'bg-zinc-700'}`}
                  onClick={() => setSelectedFaltaTeam('B')}
                >
                  {timeBName}
                </button>
              </div>
              <div className="space-y-2">
                {(selectedFaltaTeam === 'A' ? jogadoresA : jogadoresB).map((jogador) => (
                  <button
                    key={`falta-${selectedFaltaTeam}-${jogador.id}`}
                    className="w-full p-2 bg-zinc-700 rounded hover:bg-zinc-600"
                    onClick={() => {
                      const tempoAtual = `${minutes}:${formattedSeconds}`;
                      const novaFalta: Falta = {
                        time: selectedFaltaTeam,
                        jogadorId: jogador.id,
                        tempo: tempoAtual
                      };
                      setFaltas([...faltas, novaFalta]);
                      if (selectedFaltaTeam === 'A') {
                        setFaltasA(faltasA + 1);
                        setJogadoresA(jogadoresA.map(j =>
                          j.id === jogador.id ? { ...j, faltas: j.faltas + 1 } : j
                        ));
                      } else {
                        setFaltasB(faltasB + 1);
                        setJogadoresB(jogadoresB.map(j =>
                          j.id === jogador.id ? { ...j, faltas: j.faltas + 1 } : j
                        ));
                      }
                      setShowFaltaModal(false);
                    }}
                  >
                    {jogador.nome}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="mt-4 w-full p-2 bg-red-500 rounded hover:bg-red-600"
              onClick={() => setShowFaltaModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Popover para adicionar jogador ao banco */}
      {showAddBenchPlayerPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-4 rounded-lg w-80">
            <h3 className="text-xl font-bold mb-4">Adicionar Jogador ao Banco</h3>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nome do jogador"
              className="w-full p-2 bg-zinc-700 rounded mb-4"
              onKeyPress={(e) => e.key === 'Enter' && adicionarJogadorAoBanco()}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 p-2 bg-green-500 rounded hover:bg-green-600"
                onClick={adicionarJogadorAoBanco}
              >
                Adicionar
              </button>
              <button
                className="flex-1 p-2 bg-red-500 rounded hover:bg-red-600"
                onClick={() => setShowAddBenchPlayerPopover(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaused && activeTab === 'placar' && (
        <div className="mt-5 border-t border-zinc-700 pt-4">
          {/* Área de jogadores disponíveis (banco) */}
          <div className="w-full px-4 py-4 bg-zinc-800 border-b border-zinc-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Banco de Jogadores</h2>
              <button
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                onClick={() => setShowAddBenchPlayerPopover(true)}
              >
                Adicionar Jogador
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 ">
              {jogadoresBanco.map((jogador, index) => (
                <div
                  key={`banco-${jogador.id}-${index}`}
                  className="bg-zinc-700 p-3 rounded-lg shadow w-auto"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{jogador.nome}</h3>
                    <div className="flex gap-1">
                      <button
                        className="p-1 bg-red-500 text-xs rounded hover:bg-red-600"
                        onClick={() => adicionarAoTime(jogador, 'A')}
                      >
                        {timeAName}
                      </button>
                      <button
                        className="p-1 bg-blue-500 text-xs rounded hover:bg-blue-600"
                        onClick={() => adicionarAoTime(jogador, 'B')}
                      >
                        {timeBName}
                      </button>
                    </div>
                  </div>

                  {/* Barra de stamina */}
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${jogador.stamina > 70 ? 'bg-green-500' :
                          jogador.stamina > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${jogador.stamina}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Estamina: {(Number(jogador.stamina ?? 100)).toFixed(0)}%
                  </div>

                  {/* Stats do jogador */}
                  {jogador.pontos > 0 && (
                    <div className="mt-2 text-xs text-gray-300">
                      <p>Pontos: {jogador.pontos}</p>
                      <p>Faltas: {jogador.faltas}</p>
                    </div>
                  )}
                  
                  {/* Botão para remover o jogador */}
                  <button
                    className="w-full mt-2 p-1 bg-red-800 text-xs rounded hover:bg-red-900"
                    onClick={() => iniciarRemocaoJogador(jogador)}
                  >
                    Remover Jogador
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Área de Times */}
          <div className="w-full px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-800 border-b border-zinc-600">
            {/* Time A */}
            <div className="bg-zinc-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-500">{timeAName}</h2>
                <div className="text-2xl font-bold">{pontosA} pts</div>
              </div>

              {/* <div className="flex justify-between items-center mb-4">
                <div>Faltas: {faltasA}</div>
                <button
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-sm"
                  onClick={() => abrirModalFalta('A')}
                >
                  + Falta
                </button>
              </div> */}

              <div className="space-y-3">
                {jogadoresA.map((jogador) => (
                  <div
                    key={`timeA-${jogador.id}`}
                    className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold">{jogador.nome}</h3>
                      <div className="text-sm text-gray-400">
                        {jogador.pontos} pts | {jogador.faltas} faltas
                      </div>

                      {/* Barra de stamina */}
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full ${jogador.stamina > 70 ? 'bg-green-500' :
                              jogador.stamina > 30 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${jogador.stamina}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Estamina: {(Number(jogador.stamina ?? 100)).toFixed(0)}%
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="p-2 bg-zinc-700 rounded hover:bg-zinc-600"
                        onClick={() => voltarParaBanco(jogador)}
                      >
                        Banco
                      </button>
                      
                      <button
                        className="p-2 bg-red-700 rounded hover:bg-red-800"
                        onClick={() => iniciarRemocaoJogador(jogador)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time B */}
            <div className="bg-zinc-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-500">{timeBName}</h2>
                <div className="text-2xl font-bold">{pontosB} pts</div>
              </div>

              {/* <div className="flex justify-between items-center mb-4">
                <div>Faltas: {faltasB}</div>
                <button
                  className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-sm"
                  onClick={() => abrirModalFalta('B')}
                >
                  + Falta
                </button>
              </div> */}

              <div className="space-y-3">
                {jogadoresB.map((jogador) => (
                  <div
                    key={`timeB-${jogador.id}`}
                    className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold">{jogador.nome}</h3>
                      <div className="text-sm text-gray-400">
                        {jogador.pontos} pts | {jogador.faltas} faltas
                      </div>

                      {/* Barra de stamina */}
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full ${jogador.stamina > 70 ? 'bg-green-500' :
                            jogador.stamina > 30 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${jogador.stamina}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Estamina: {(Number(jogador.stamina ?? 100)).toFixed(0)}%
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="p-2 bg-zinc-700 rounded hover:bg-zinc-600"
                        onClick={() => voltarParaBanco(jogador)}
                      >
                        Banco
                      </button>
                      
                      <button
                        className="p-2 bg-red-700 rounded hover:bg-red-800"
                        onClick={() => iniciarRemocaoJogador(jogador)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ... existing code ... */}
        </div>
      )}
      {/* ... existing code ... */}
      
      {/* Modal de confirmação para remoção de jogador */}
      {showRemoveConfirmation && jogadorParaRemover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-80">
            <h3 className="text-xl font-bold mb-4">Confirmar Remoção</h3>
            <p className="mb-6">
              Tem certeza que deseja remover o jogador <span className="font-bold">{jogadorParaRemover.nome}</span>?
              Esta ação não poderá ser desfeita.
            </p>
            
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-zinc-600 rounded hover:bg-zinc-700"
                onClick={() => {
                  setShowRemoveConfirmation(false);
                  setJogadorParaRemover(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                onClick={removerJogador}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
