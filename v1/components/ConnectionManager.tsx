import React, { useState } from 'react';

interface ConnectionManagerProps {
  onCreateGame: () => Promise<string>;
  onJoinGame: (offer: string) => Promise<string>;
  onJoinConfirm: (answer: string) => Promise<void>;
  onStartGame: (playerColor: 'w' | 'b') => void;
  onGoBack: () => void;
}

type Mode = 'init' | 'creating' | 'joining' | 'awaiting-confirm';

const ConnectionManager: React.FC<ConnectionManagerProps> = ({ onCreateGame, onJoinGame, onJoinConfirm, onStartGame, onGoBack }) => {
  const [mode, setMode] = useState<Mode>('init');
  const [offer, setOffer] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    try {
      setError('');
      const offer = await onCreateGame();
      setOffer(offer);
      setMode('creating');
    } catch (e) {
      setError('Failed to create offer. Please try again.');
      setMode('init');
    }
  };

  const handleJoin = () => {
    setMode('joining');
    setError('');
  };

  const handleReceiveOffer = async () => {
    if (!offer.trim()) {
      setError('Please paste the offer code.');
      return;
    }
    try {
      setError('');
      const answer = await onJoinGame(offer);
      setAnswer(answer);
      setMode('awaiting-confirm');
      onStartGame('b');
    } catch (e) {
      setError('Invalid offer code or failed to create answer.');
    }
  };

  const handleReceiveAnswer = async () => {
    if (!answer.trim()) {
      setError('Please paste the answer code.');
      return;
    }
    try {
        setError('');
        await onJoinConfirm(answer);
        onStartGame('w');
    } catch(e) {
        setError('Invalid answer code or failed to connect.');
    }
  };
  
  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };
  
  const renderContent = () => {
      switch(mode) {
          case 'init':
              return (
                  <div className="flex flex-col sm:flex-row justify-center gap-4 text-base">
                      <button onClick={handleCreate} className="btn">Create P2P Game</button>
                      <button onClick={handleJoin} className="btn">Join P2P Game</button>
                      <button onClick={onGoBack} className="btn">Back</button>
                  </div>
              );
          case 'creating':
              return (
                  <div className="space-y-4 text-base">
                      <h3 className="text-xl font-semibold text-center">1. Send this offer to your opponent</h3>
                      <textarea readOnly value={offer} className="w-full h-24 p-2 resize-none" />
                      <button onClick={() => copyToClipboard(offer)} className="w-full btn">Copy Offer</button>
                      <h3 className="text-xl font-semibold text-center mt-6">2. Paste their answer here</h3>
                      <textarea value={answer} onChange={e => setAnswer(e.target.value)} className="w-full h-24 p-2 resize-none" placeholder="Paste answer from opponent..." />
                      <button onClick={handleReceiveAnswer} className="w-full btn">Connect</button>
                      <button onClick={onGoBack} className="w-full py-2 mt-4 btn">Back</button>
                  </div>
              )
          case 'joining':
                return (
                    <div className="space-y-4 text-base">
                      <h3 className="text-xl font-semibold text-center">1. Paste the offer from your opponent</h3>
                      <textarea value={offer} onChange={e => setOffer(e.target.value)} className="w-full h-24 p-2 resize-none" placeholder="Paste offer code..."/>
                      <button onClick={handleReceiveOffer} className="w-full btn">Generate Answer</button>
                      <button onClick={onGoBack} className="w-full py-2 mt-4 btn">Back</button>
                    </div>
                );
          case 'awaiting-confirm':
            return (
                <div className="space-y-4 text-base">
                  <h3 className="text-xl font-semibold text-center">2. Send this answer to your opponent</h3>
                  <textarea readOnly value={answer} className="w-full h-24 p-2 resize-none" />
                  <button onClick={() => copyToClipboard(answer)} className="w-full btn">Copy Answer</button>
                  <p className="text-center">Waiting for opponent to connect...</p>
                  <button onClick={onGoBack} className="w-full py-2 mt-4 btn">Back</button>
                </div>
              );
      }
  }


  return (
    <div className="w-full max-w-2xl mx-auto p-8 panel space-y-6" style={{animation: 'fadeIn 0.5s ease-out'}}>
      <h2 className="text-2xl font-bold text-center uppercase">Peer-to-Peer Connection</h2>
      {error && <p className="text-red-400 text-center bg-red-500/10 border border-red-500 p-3">{error}</p>}
      {renderContent()}
    </div>
  );
};

export default ConnectionManager;