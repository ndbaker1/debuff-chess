import React, { useState } from 'react';
import { CornerBox } from './CornerBox';

type Stage = 'INIT' | 'CREATING' | 'JOINING' | 'WAITING_FOR_ANSWER' | 'WAITING_FOR_CONNECTION';

interface MultiplayerModalProps {
  onClose: () => void;
  onConnect: (role: 'creator' | 'joiner', offer?: string) => Promise<string | void>;
  onAcceptAnswer: (answer: string) => Promise<void>;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({ onClose, onConnect, onAcceptAnswer }) => {
    const [stage, setStage] = useState<Stage>('INIT');
    const [offerCode, setOfferCode] = useState('');
    const [answerCode, setAnswerCode] = useState('');
    const [pastedCode, setPastedCode] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateGame = async () => {
        setIsLoading(true);
        setError(null);
        setStage('CREATING');
        try {
            const offer = await onConnect('creator');
            if (typeof offer === 'string') {
                setOfferCode(offer);
                setStage('WAITING_FOR_ANSWER');
            } else {
                 setError('Failed to create a game. Please try again.');
                 setStage('INIT');
            }
        } catch (e) {
            console.error('Error creating game:', e);
            setError('Failed to create a game. Please try again.');
            setStage('INIT');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinGame = () => {
        setStage('JOINING');
        setError(null);
        setPastedCode('');
        setAnswerCode('');
    };

    const handlePastedCodeSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const trimmedCode = pastedCode.trim();
            if (stage === 'JOINING') {
                const answer = await onConnect('joiner', trimmedCode);
                if (typeof answer === 'string') {
                    setAnswerCode(answer);
                } else {
                    setError('Failed to generate response. Check the offer code.');
                }
            } else if (stage === 'WAITING_FOR_ANSWER') {
                await onAcceptAnswer(trimmedCode);
                // On success, modal will be closed by parent component via connection state change
                setStage('WAITING_FOR_CONNECTION');
            }
        } catch (e) {
            console.error('Connection error:', e);
            const errorMessage = e instanceof Error ? e.message : 'Invalid code or connection failed.';
            setError(`${errorMessage} Please try again.`);
            if (stage === 'WAITING_FOR_CONNECTION') {
                setStage('WAITING_FOR_ANSWER'); // Go back if connection fails
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const renderContent = () => {
        switch (stage) {
            case 'INIT':
                return (
                    <>
                        <h2 className="text-4xl text-cyan-400 text-glow-cyan mb-6">PLAY P2P</h2>
                        <div className="flex flex-col gap-4">
                            <button onClick={handleCreateGame} className="text-2xl border-2 border-cyan-400 px-6 py-3 hover:bg-cyan-400/20 transition-colors cyan-glow" disabled={isLoading}>
                                {isLoading ? 'CREATING...' : 'CREATE GAME'}
                            </button>
                            <button onClick={handleJoinGame} className="text-2xl border-2 border-fuchsia-400 px-6 py-3 hover:bg-fuchsia-400/20 transition-colors magenta-glow">
                                JOIN GAME
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </>
                );
            case 'CREATING':
                return <p className="text-2xl animate-pulse">Generating offer code...</p>;
            
            case 'WAITING_FOR_ANSWER':
                return (
                    <>
                        <h2 className="text-3xl text-cyan-400 mb-2">1. SEND THIS CODE</h2>
                        <p className="text-gray-400 mb-4">Send this code to your opponent. They will use it to generate a response code.</p>
                        <textarea readOnly value={offerCode} className="w-full h-24 bg-gray-900 border border-cyan-400 p-2 font-mono text-sm resize-none" />
                        <button onClick={() => copyToClipboard(offerCode, 'offer')} className="my-2 text-lg border border-cyan-400 px-4 py-1 hover:bg-cyan-400/20 w-full">
                            {copySuccess === 'offer' ? 'COPIED!' : 'COPY'}
                        </button>
                        
                        <h2 className="text-3xl text-cyan-400 mt-6 mb-2">2. PASTE THEIR CODE</h2>
                        <p className="text-gray-400 mb-4">Once they send a code back, paste it here and click connect.</p>
                        <textarea value={pastedCode} onChange={e => setPastedCode(e.target.value)} className="w-full h-24 bg-gray-900 border border-cyan-400 p-2 font-mono text-sm resize-none" />
                        <button onClick={handlePastedCodeSubmit} className="mt-4 text-2xl border-2 border-cyan-400 px-6 py-3 hover:bg-cyan-400/20 transition-colors cyan-glow w-full" disabled={!pastedCode || isLoading}>
                            {isLoading ? 'CONNECTING...' : 'CONNECT'}
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </>
                );
            case 'WAITING_FOR_CONNECTION':
                 return <p className="text-2xl animate-pulse">Connecting to peer...</p>;

            case 'JOINING':
                if (answerCode && !isLoading) {
                    return (
                        <>
                            <h2 className="text-3xl text-fuchsia-400 mb-2">2. SEND THIS CODE BACK</h2>
                            <p className="text-gray-400 mb-4">Send this response code back to your opponent. The game will start once they connect.</p>
                            <textarea readOnly value={answerCode} className="w-full h-24 bg-gray-900 border border-fuchsia-400 p-2 font-mono text-sm resize-none" />
                            <button onClick={() => copyToClipboard(answerCode, 'answer')} className="my-2 text-lg border border-fuchsia-400 px-4 py-1 hover:bg-fuchsia-400/20 w-full">
                                {copySuccess === 'answer' ? 'COPIED!' : 'COPY'}
                            </button>
                            <p className="mt-4 text-cyan-400 animate-pulse">Waiting for host to connect...</p>
                        </>
                    )
                }
                return (
                     <>
                        <h2 className="text-3xl text-fuchsia-400 mb-2">1. PASTE OFFER CODE</h2>
                        <p className="text-gray-400 mb-4">Paste the code from your opponent here.</p>
                        <textarea value={pastedCode} onChange={e => setPastedCode(e.target.value)} className="w-full h-24 bg-gray-900 border border-fuchsia-400 p-2 font-mono text-sm resize-none" />
                        <button onClick={handlePastedCodeSubmit} className="mt-4 text-2xl border-2 border-fuchsia-400 px-6 py-3 hover:bg-fuchsia-400/20 transition-colors magenta-glow w-full" disabled={!pastedCode || isLoading}>
                            {isLoading ? 'GENERATING...' : 'GENERATE RESPONSE'}
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                     </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <CornerBox className="w-full max-w-lg">
                <div className="relative text-center p-8 border-4 border-cyan-400 cyan-glow bg-gray-900 w-full">
                    <button onClick={onClose} className="absolute top-2 right-4 text-4xl text-gray-500 hover:text-white">&times;</button>
                    {renderContent()}
                </div>
            </CornerBox>
        </div>
    );
};