import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard from './components/Chessboard';
import ConnectionManager from './components/ConnectionManager';
import DebuffModal from './components/DebuffModal';
import MoveHistory from './components/MoveHistory';
import MainMenu from './components/MainMenu';
import GameHeader from './components/GameHeader';
import PlayerInfoBar from './components/PlayerInfoBar';
import DebuffsPanel from './components/DebuffsPanel';
import { useWebRTC } from './hooks/useWebRTC';
import { type Debuff, type GameMessage, type PlayerColor, type Move, type GamePhase, type HistoryEntry } from './types';
import { DEBUFFS } from './constants';

type PendingMove = {
    fenBefore: string;
    move: Move;
    san: string;
    color: PlayerColor;
};

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [playerColor, setPlayerColor] = useState<PlayerColor | null>(null);
  const [activeDebuff, setActiveDebuff] = useState<Debuff | null>(null);
  const [showDebuffModal, setShowDebuffModal] = useState(false);
  const [debuffChoices, setDebuffChoices] = useState<Debuff[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [pendingOpponentMove, setPendingOpponentMove] = useState<PendingMove | null>(null);
  const [isLocalGame, setIsLocalGame] = useState(false);
  const [isWaitingForDebuff, setIsWaitingForDebuff] = useState(false);
  const [outgoingDebuff, setOutgoingDebuff] = useState<Debuff | null>(null);


  const resetGameState = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setActiveDebuff(null);
    setShowDebuffModal(false);
    setHistory([]);
    setPendingMove(null);
    setPendingOpponentMove(null);
    setIsWaitingForDebuff(false);
    setOutgoingDebuff(null);
  }

  const handleIncomingMessage = useCallback((message: GameMessage) => {
    switch (message.type) {
      case 'MOVE': {
        const fenBefore = game.fen();
        const color = game.turn();
        const newGame = new Chess(fenBefore);
        const moveResult = newGame.move(message.move);
        if (moveResult) {
            setOutgoingDebuff(null);
            setPendingOpponentMove({ fenBefore, move: message.move, san: moveResult.san, color });
            setGame(newGame);
            setFen(newGame.fen());
            setIsWaitingForDebuff(true);
        }
        break;
      }
      case 'DEBUFF': {
        const selectedDebuff = DEBUFFS.find(d => d.id === message.debuffId) || null;
        setActiveDebuff(selectedDebuff);
        setIsWaitingForDebuff(false);

        if (pendingOpponentMove && selectedDebuff) {
            setHistory(prev => [...prev, { ...pendingOpponentMove, debuff: selectedDebuff }]);
            setPendingOpponentMove(null);
        }
        break;
      }
      case 'RESET':
        if(message.isRequest) {
            sendMessage({type: 'RESET', isRequest: false });
        }
        resetGameState();
        setGameStatus('New game started.');
        break;
      case 'START_GAME':
        setPlayerColor(message.playerColor);
        setGamePhase('playing');
        break;
    }
  }, [game, pendingOpponentMove]);
  
  const { isConnected, createOffer, handleOffer, handleAnswer, sendMessage, closeConnection } = useWebRTC(handleIncomingMessage);

  useEffect(() => {
    if (isConnected && gamePhase === 'connecting') {
        if(playerColor === 'w') {
            sendMessage({type: 'START_GAME', playerColor: 'b'});
        }
        setGamePhase('playing');
    }
    if(!isConnected && gamePhase === 'playing' && !isLocalGame) {
        setGameStatus('Opponent disconnected.');
        setGamePhase('gameOver');
    }
  }, [isConnected, gamePhase, playerColor, sendMessage, isLocalGame]);

  const isMyTurn = useMemo(() => {
    if (isLocalGame) return true;
    if (!playerColor) return false;
    return game.turn() === playerColor && !isWaitingForDebuff;
  }, [game, playerColor, isLocalGame, isWaitingForDebuff]);

  const updateGameStatus = useCallback(() => {
    if (isWaitingForDebuff) {
      setGameStatus("Opponent is choosing a debuff...");
      return;
    }

    let status = '';
    if (game.isCheckmate()) {
      status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
      setGamePhase('gameOver');
    } else if (game.isDraw() || game.isStalemate()) {
      status = 'Game is a draw.';
      setGamePhase('gameOver');
    } else {
      if (isLocalGame) {
        status = `${game.turn() === 'w' ? 'White' : 'Black'}'s turn${game.inCheck() ? ' (in check)' : ''}.`;
      } else {
        status = `${isMyTurn ? 'Your' : "Opponent's"} turn${game.inCheck() && isMyTurn ? ' (in check)' : ''}.`;
      }
    }
    setGameStatus(status);
  }, [game, isMyTurn, isLocalGame, isWaitingForDebuff]);

  useEffect(() => {
    if(gamePhase === 'playing' || gamePhase === 'gameOver') {
      updateGameStatus();
    }
  }, [fen, gamePhase, updateGameStatus]);

  const handleMove = (move: Move) => {
    const fenBefore = game.fen();
    const color = game.turn();
    const newGame = new Chess(fenBefore);
    const moveResult = newGame.move(move);

    if (moveResult) {
      setGame(newGame);
      setFen(newGame.fen());
      setPendingMove({ fenBefore, move, san: moveResult.san, color });
      setActiveDebuff(null);
      if (!isLocalGame) {
          sendMessage({ type: 'MOVE', move });
      }
      
      const shuffledDebuffs = [...DEBUFFS].sort(() => 0.5 - Math.random());
      setDebuffChoices(shuffledDebuffs.slice(0, 3));
      setShowDebuffModal(true);
    }
  };

  const handleSelectDebuff = (debuff: Debuff) => {
    if (pendingMove) {
      setHistory(prev => [...prev, { ...pendingMove, debuff }]);
    }
    setPendingMove(null);
    setShowDebuffModal(false);

    if (isLocalGame) {
        setActiveDebuff(debuff);
    } else {
        sendMessage({ type: 'DEBUFF', debuffId: debuff.id });
        setOutgoingDebuff(debuff);
    }
  };
  
  const handleResetRequest = () => {
    if (!isLocalGame) {
      sendMessage({ type: 'RESET', isRequest: true });
    }
    resetGameState();
  };

  const handleStartP2PGame = (color: PlayerColor) => {
    setPlayerColor(color);
    setGamePhase('connecting');
  };

  const handleStartLocalGame = () => {
    setIsLocalGame(true);
    setPlayerColor('w');
    setGamePhase('playing');
    resetGameState();
  };
  
  const handleStartP2PSetup = () => {
    setGamePhase('setup');
  }

  const goToMainMenu = () => {
    if (!isLocalGame) {
        closeConnection();
    }
    setIsLocalGame(false);
    setPlayerColor(null);
    setGamePhase('menu');
    resetGameState();
  }

  const renderGamePhase = () => {
    switch (gamePhase) {
      case 'menu':
        return (
          <MainMenu 
            onPlayLocal={handleStartLocalGame} 
            onPlayP2P={handleStartP2PSetup} 
          />
        );
      case 'setup':
      case 'connecting':
        return (
          <ConnectionManager
            onCreateGame={createOffer}
            onJoinGame={handleOffer}
            onJoinConfirm={handleAnswer}
            onStartGame={handleStartP2PGame}
            onGoBack={goToMainMenu}
          />
        );
      case 'playing':
      case 'gameOver':
        return (
          <div className="w-full h-screen flex flex-col p-4 md:p-6 lg:p-8 gap-4">
            {showDebuffModal && <DebuffModal debuffs={debuffChoices} onSelectDebuff={handleSelectDebuff} />}
            <GameHeader onNewGame={handleResetRequest} onDisconnect={goToMainMenu} />
            <PlayerInfoBar 
              player1Name={isLocalGame ? "White" : (playerColor === 'w' ? "You" : "Opponent")}
              player2Name={isLocalGame ? "Black" : (playerColor === 'b' ? "You" : "Opponent")}
              gameStatus={gameStatus}
              turn={game.turn()}
            />
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
              <div className="lg:col-span-2 flex items-center justify-center lg:order-2">
                 <div className="w-full max-w-[80vh] aspect-square panel p-2">
                    <Chessboard
                      game={game}
                      onMove={handleMove}
                      playerColor={playerColor!}
                      isMyTurn={isMyTurn}
                      activeDebuff={activeDebuff}
                    />
                  </div>
              </div>
              <div className="lg:col-span-1 flex flex-col gap-8 lg:order-1">
                <DebuffsPanel
                  activeDebuff={activeDebuff}
                  outgoingDebuff={outgoingDebuff}
                  isMyTurn={isMyTurn}
                  isLocalGame={isLocalGame}
                  turn={game.turn()}
                  isWaitingForDebuff={isWaitingForDebuff}
                />
                <MoveHistory history={history} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      {renderGamePhase()}
    </main>
  );
};

export default App;
