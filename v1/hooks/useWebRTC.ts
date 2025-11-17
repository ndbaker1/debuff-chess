
import { useState, useRef, useCallback, useEffect } from 'react';
import { type GameMessage } from '../types';

const PEER_CONNECTION_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const useWebRTC = (onMessage: (data: GameMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const dc = useRef<RTCDataChannel | null>(null);

  // Use a ref to hold the latest onMessage callback
  // This prevents stale closures in the onmessage event handler
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const sendMessage = useCallback((data: GameMessage) => {
    if (dc.current && dc.current.readyState === 'open') {
      dc.current.send(JSON.stringify(data));
    }
  }, []);

  const closeConnection = useCallback(() => {
    if (dc.current) {
        dc.current.close();
        dc.current = null;
    }
    if (pc.current) {
        pc.current.close();
        pc.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);
  
  const setupDataChannel = useCallback((dataChannel: RTCDataChannel) => {
    dataChannel.onopen = () => {
      console.log('Data channel is open');
      setIsConnected(true);
    };
    dataChannel.onclose = () => {
      console.log('Data channel is closed');
      setIsConnected(false);
    };
    dataChannel.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error('Failed to parse incoming message JSON:', event.data, error);
        return;
      }
      try {
        // Call the latest onMessage callback via the ref
        onMessageRef.current(data as GameMessage);
      } catch (error) {
        console.error('Error processing message:', data, error);
      }
    };
    dc.current = dataChannel;
  }, []); // onMessage is removed from dependencies as we use a ref

  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    peerConnection.oniceconnectionstatechange = () => {
        if(peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'closed') {
            setIsConnected(false);
        }
    };

    peerConnection.ondatachannel = (event) => {
        console.log('ondatachannel');
        setupDataChannel(event.channel);
    };

    pc.current = peerConnection;
    return peerConnection;
  }, [setupDataChannel]);

  const createOffer = useCallback(async () => {
    const peerConnection = createPeerConnection();
    const dataChannel = peerConnection.createDataChannel('game-channel');
    setupDataChannel(dataChannel);
    
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    return new Promise<string>((resolve) => {
      peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
          resolve(JSON.stringify(peerConnection.localDescription));
        }
      };
    });
  }, [createPeerConnection, setupDataChannel]);

  const handleOffer = useCallback(async (offerSdp: string) => {
    const peerConnection = createPeerConnection();
    const offer = JSON.parse(offerSdp);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    return new Promise<string>((resolve) => {
      peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
          resolve(JSON.stringify(peerConnection.localDescription));
        }
      };
    });
  }, [createPeerConnection]);

  const handleAnswer = useCallback(async (answerSdp: string) => {
    if (pc.current) {
      const answer = JSON.parse(answerSdp);
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  return { isConnected, createOffer, handleOffer, handleAnswer, sendMessage, closeConnection };
};
