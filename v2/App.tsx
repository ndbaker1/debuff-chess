
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Board, Move, Debuff } from './types';
import { PlayerColor, DebuffId, PieceType } from './types';
import { Chessboard } from './components/Chessboard';
import { MoveHistory } from './components/MoveHistory';
import { DebuffPanel } from './components/DebuffPanel';
import { getInitialBoard, getValidMoves, createMove } from './services/chessLogic';
import { ParticleBackground } from './components/ParticleBackground';
import { WebRTCService, P2PMessage, P2PMessageType } from './services/webrtcService';
import { MultiplayerModal } from './components/MultiplayerModal';
import { DebuffSelectionModal } from './components/DebuffSelectionModal';
import { CornerBox } from './components/CornerBox';
import { MainMenu } from './components/MainMenu';
import { ALL_DEBUFFS, DEBUFFS } from './services/debuffs';

enum GameMode {
    LOCAL = 'LOCAL',
    P2P = 'P2P'
}

enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING'
}

const App: React.FC = () => {
    const [board, setBoard] = useState<Board>(getInitialBoard());
    const [turn, setTurn] = useState<PlayerColor>(PlayerColor.WHITE);
    const [history, setHistory] = useState<Move[]>([]);
    const [historyPreview, setHistoryPreview] = useState<Board | null>(null);
    const [previewedMove, setPreviewedMove] = useState<Move | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
    const [validMoves, setValidMoves] = useState<{ to: [number, number] }[]>([]);
    const [debuffs, setDebuffs] = useState<{ w: DebuffId; b: DebuffId }>({ w: DebuffId.NONE, b: DebuffId.NONE });
    const [winner, setWinner] = useState<PlayerColor | null>(null);
    const [showDebuffModal, setShowDebuffModal] = useState(false);
    const [debuffChoices, setDebuffChoices] = useState<Debuff[]>([]);

    const [gameMode, setGameMode] = useState<GameMode>(GameMode.LOCAL);
    const [playerColorP2P, setPlayerColorP2P] = useState<PlayerColor | null>(null);
    const [showMultiplayerModal, setShowMultiplayerModal] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<RTCIceConnectionState>('disconnected');
    const webrtcService = useRef<WebRTCService | null>(null);
    const onDataRef = useRef<((message: P2PMessage) => void) | null>(null);
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);

    useEffect(() => {
        // When the P2P connection is established, close the modal.
        if (connectionStatus === 'connected') {
            setShowMultiplayerModal(false);
        }
    }, [connectionStatus]);

    // This function handles resetting the game state.
    // In a P2P context, it can either reset just the match (keepP2PSession = true)
    // or tear down the entire connection.
    const resetGame = useCallback((isP2PRequest: boolean, keepP2PSession = false) => {
        // If we're in a P2P game and the local user initiated the reset, notify the peer.
        if (gameMode === GameMode.P2P && !isP2PRequest) {
            webrtcService.current?.send({ type: P2PMessageType.RESET });
        }
    
        // Reset core game state for a new match.
        setBoard(getInitialBoard());
        setTurn(PlayerColor.WHITE);
        setHistory([]);
        setHistoryPreview(null);
        setSelectedSquare(null);
        setValidMoves([]);
        setDebuffs({ w: DebuffId.NONE, b: DebuffId.NONE });
        setWinner(null);
        setShowDebuffModal(false);

        // If we're keeping the P2P session, we're done.
        if (keepP2PSession) {
            return;
        }

        // Otherwise, tear down the P2P session and return to local mode.
        if (webrtcService.current) {
            webrtcService.current.close();
            webrtcService.current = null;
        }
        setGameMode(GameMode.LOCAL);
        setPlayerColorP2P(null);
        setConnectionStatus('disconnected');
    }, [gameMode]);
    
    const handleSelectPiece = useCallback((from: [number, number]) => {
        if (winner) return;

        if(from[0] === -1) { // Deselect
            setSelectedSquare(null);
            setValidMoves([]);
            return;
        }

        const piece = board[from[0]][from[1]];
        if (piece && piece.color === turn) {
            const currentDebuff = DEBUFFS[debuffs[turn]];
            const moves = getValidMoves(board, from, currentDebuff, { from, selectedSquare });

            if (moves.length > 0 || (selectedSquare && from[0] === selectedSquare[0] && from[1] === selectedSquare[1])) {
                 setSelectedSquare(from);
                 setValidMoves(moves);
            }
        }
    }, [board, turn, debuffs, winner, selectedSquare]);

    const handleMove = useCallback((from: [number, number], to: [number, number], fromPeer: boolean = false) => {
        if (winner) return;

        const currentDebuff = debuffs[turn];
        const move = createMove(board, from, to, currentDebuff);
        const newBoard = JSON.parse(JSON.stringify(board));
        const pieceToMove = newBoard[from[0]][from[1]];
        
        const targetPiece = newBoard[to[0]][to[1]];
        if (targetPiece?.type === PieceType.KING) {
            setWinner(turn);
            if (gameMode === GameMode.P2P && !fromPeer) {
                webrtcService.current?.send({ type: P2PMessageType.GAME_OVER, payload: { winner: turn }});
            }
        }

        newBoard[to[0]][to[1]] = pieceToMove;
        newBoard[from[0]][from[1]] = null;

        setBoard(newBoard);
        setHistory(prev => [...prev, move]);
        setSelectedSquare(null);
        setValidMoves([]);
        
        if (gameMode === GameMode.P2P && !fromPeer) {
            webrtcService.current?.send({ type: P2PMessageType.MOVE, payload: { from, to } });
        }
        
        if (!fromPeer) {
            const shuffled = [...ALL_DEBUFFS].sort(() => 0.5 - Math.random());
            setDebuffChoices(shuffled.slice(0, 3));
            setShowDebuffModal(true);
        }
        
    }, [board, turn, winner, gameMode, debuffs]);

    const getOpponent = (player: PlayerColor) => player === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;

    const handleConfirmDebuff = useCallback((debuffId: DebuffId, fromPeer: boolean = false) => {
        if (winner) return;

        const opponent = getOpponent(turn);
        setDebuffs(prev => ({...prev, [opponent]: debuffId}));
        
        if (gameMode === GameMode.P2P && !fromPeer) {
            webrtcService.current?.send({ type: P2PMessageType.DEBUFF, payload: { debuffId } });
        }
        
        setTurn(getOpponent);
        setShowDebuffModal(false);
    }, [turn, winner, gameMode]);

    const handleHoverMove = (index: number | null) => {
        if (index === null || index < 0) {
            setHistoryPreview(null);
            setPreviewedMove(null);
        } else {
            setHistoryPreview(history[index].boardBefore);
            setPreviewedMove(history[index]);
        }
    };

    const handleDataReceived = useCallback((message: P2PMessage) => {
        switch (message.type) {
            case P2PMessageType.MOVE:
                handleMove(message.payload.from, message.payload.to, true);
                break;
            case P2PMessageType.DEBUFF:
                handleConfirmDebuff(message.payload.debuffId, true);
                break;
            case P2PMessageType.RESET:
                // When a peer requests a reset, keep the P2P session alive.
                resetGame(true, true);
                break;
            case P2PMessageType.GAME_OVER:
                setWinner(message.payload.winner);
                break;
        }
    }, [handleMove, handleConfirmDebuff, resetGame]); 

    useEffect(() => {
        onDataRef.current = handleDataReceived;
    }, [handleDataReceived]);

    const setupWebRTCService = () => {
        const service = new WebRTCService();
        service.onData = (message) => onDataRef.current?.(message);
        service.onConnectionStateChange = (state) => {
            setConnectionStatus(state);
            if (state === 'disconnected' || state === 'failed') {
                 if (gameMode === GameMode.P2P) {
                    console.log("Peer disconnected");
                    resetGame(true);
                }
            }
        };
        webrtcService.current = service;
        return service;
    };

    const handleP2PConnect = async (role: 'creator' | 'joiner', offer?: string): Promise<string | void> => {
        const service = setupWebRTCService();
        if (role === 'creator') {
            setPlayerColorP2P(PlayerColor.WHITE);
            return service.createOffer();
        } else if (role === 'joiner' && offer) {
            setPlayerColorP2P(PlayerColor.BLACK);
            const answer = await service.createAnswer(offer);
            return answer;
        }
    };

    const handleAcceptP2PAnswer = async (answer: string) => {
        await webrtcService.current?.acceptAnswer(answer);
    };

    const handleOpenP2PModal = () => {
        resetGame(true);
        setGameMode(GameMode.P2P);
        setShowMultiplayerModal(true);
    };
    
    const handleGoToMenu = () => {
        resetGame(false);
        setGameState(GameState.MENU);
    };

    const handlePlayLocal = () => {
        resetGame(true);
        setGameState(GameState.PLAYING);
    };

    const handlePlayP2P = () => {
        handleOpenP2PModal();
        setGameState(GameState.PLAYING);
    };

    const activeDebuffId = debuffs[turn];
    const activeDebuff = DEBUFFS[activeDebuffId] ?? null;
    const isDebuffOnMe = gameMode === GameMode.P2P && playerColorP2P === turn;
    const isMyTurn = gameMode === GameMode.LOCAL || (gameMode === GameMode.P2P && turn === playerColorP2P);

    return (
        <div className="min-h-screen text-white font-pixel flex flex-col items-center p-2 sm:p-4 md:p-8 relative">
            <ParticleBackground />

            {gameState === GameState.MENU && <MainMenu onPlayLocal={handlePlayLocal} onPlayP2P={handlePlayP2P} />}
            
            {gameState === GameState.PLAYING && (
              <>
                {showMultiplayerModal && <MultiplayerModal onClose={() => {
                        setShowMultiplayerModal(false);
                        if (connectionStatus !== 'connected') {
                            handleGoToMenu();
                        }
                    }} onConnect={handleP2PConnect} onAcceptAnswer={handleAcceptP2PAnswer} />}
                
                {showDebuffModal && (
                    <DebuffSelectionModal 
                        debuffs={debuffChoices}
                        onSelectDebuff={handleConfirmDebuff}
                        opponentColor={getOpponent(turn)}
                    />
                )}

                <header className="w-full max-w-7xl flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-4xl md:text-5xl text-glow-cyan tracking-widest">DEBUFF CHESS</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleGoToMenu} className="text-xl border-2 border-fuchsia-400 px-4 py-2 hover:bg-fuchsia-400/20 transition-colors magenta-glow">
                            MAIN MENU
                        </button>
                        <button onClick={() => resetGame(false, gameMode === GameMode.P2P)} className="text-xl border-2 border-cyan-400 px-4 py-2 hover:bg-cyan-400/20 transition-colors cyan-glow">
                            NEW GAME
                        </button>
                    </div>
                </header>

                {winner && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <CornerBox>
                            <div className="text-center p-8 border-4 border-cyan-400 cyan-glow bg-gray-900">
                                <h2 className="text-6xl text-cyan-400 text-glow-cyan mb-4">GAME OVER</h2>
                                <p className="text-4xl mb-8">{(winner === PlayerColor.WHITE ? 'WHITE' : 'BLACK')} WINS!</p>
                                <button onClick={() => resetGame(false, gameMode === GameMode.P2P)} className="text-3xl border-2 border-cyan-400 px-8 py-4 hover:bg-cyan-400/20 transition-colors cyan-glow">
                                    PLAY AGAIN
                                </button>
                            </div>
                        </CornerBox>
                    </div>
                )}
                
                <main className="w-full max-w-7xl flex flex-col lg:flex-row items-start gap-8 relative z-10">
                    {/* Left Panel */}
                    <div className="w-full lg:w-1/4 flex flex-col-reverse lg:flex-col gap-8 order-2 lg:order-1">
                        <MoveHistory history={history} onHoverMove={handleHoverMove} currentMoveIndex={history.length} />
                        <DebuffPanel 
                            activeDebuff={activeDebuff}
                            isDebuffOnMe={isDebuffOnMe}
                            previewedMove={previewedMove}
                            debuffs={ALL_DEBUFFS}
                            turn={turn}
                        />
                    </div>

                    {/* Center Panel */}
                    <div className="w-full lg:w-3/4 flex flex-col items-center gap-4 order-1 lg:order-2">
                        {/* Player Info Bar */}
                        <CornerBox className="w-full">
                            <div className="w-full bg-gray-800/50 border-2 border-cyan-400 p-2 flex justify-between items-center text-2xl cyan-glow">
                                <div className={`px-4 py-1 rounded-lg transition-all duration-300 ${turn === PlayerColor.WHITE ? 'bg-cyan-400/20 cyan-glow' : 'bg-transparent'}`}>
                                    <span className={`transition-all duration-300 ${turn === PlayerColor.WHITE ? 'text-glow-cyan' : ''}`}>{gameMode === GameMode.P2P && playerColorP2P === PlayerColor.WHITE ? 'YOU (WHITE)' : 'PLAYER 1 (WHITE)'}</span>
                                </div>

                                {gameMode === GameMode.P2P && (
                                    <div className={`text-lg px-2 rounded transition-colors ${connectionStatus === 'connected' ? 'bg-green-500/50 text-green-200' : 'bg-yellow-500/50 text-yellow-200 animate-pulse'}`}>
                                        {connectionStatus.toUpperCase()}
                                    </div>
                                )}

                                <div className={`px-4 py-1 rounded-lg transition-all duration-300 ${turn === PlayerColor.BLACK ? 'bg-fuchsia-400/20 magenta-glow' : 'bg-transparent'}`}>
                                    <span className={`transition-all duration-300 ${turn === PlayerColor.BLACK ? 'text-glow-magenta' : ''}`}>{gameMode === GameMode.P2P && playerColorP2P === PlayerColor.BLACK ? 'YOU (BLACK)' : 'PLAYER 2 (BLACK)'}</span>
                                </div>
                            </div>
                        </CornerBox>

                        <Chessboard 
                            board={board} 
                            turn={turn} 
                            onMove={handleMove}
                            validMoves={validMoves}
                            onSelectPiece={handleSelectPiece}
                            selectedSquare={selectedSquare}
                            historyPreview={historyPreview}
                            disabled={!isMyTurn || showDebuffModal}
                            previewedMove={previewedMove}
                        />
                    </div>
                </main>
              </>
            )}
        </div>
    );
};

export default App;
