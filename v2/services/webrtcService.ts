const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export enum P2PMessageType {
    MOVE = 'move',
    DEBUFF = 'debuff',
    RESET = 'reset',
    GAME_OVER = 'gameOver'
}

export interface P2PMessage {
    type: P2PMessageType;
    payload?: any;
}

export class WebRTCService {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;

  public onConnectionStateChange: ((state: RTCIceConnectionState) => void) | null = null;
  public onData: ((message: P2PMessage) => void) | null = null;

  private initializePeerConnection() {
    this.pc = new RTCPeerConnection(ICE_SERVERS);
    this.pc.oniceconnectionstatechange = () => {
        if (this.pc && this.onConnectionStateChange) {
            // Defer reporting 'connected' state to the data channel 'onopen' event.
            // This ensures the connection is fully ready for data exchange.
            if (this.pc.iceConnectionState !== 'connected') {
                 this.onConnectionStateChange(this.pc.iceConnectionState);
            }
        }
    };
  }

  private waitForIceGathering(): Promise<string> {
    return new Promise((resolve) => {
        if (!this.pc) return;
        // Wait for ICE gathering to complete
        this.pc.onicecandidate = (event) => {
            if (!event.candidate) {
                resolve(btoa(JSON.stringify(this.pc?.localDescription)));
            }
        };
    });
  }

  public async createOffer(): Promise<string> {
    this.initializePeerConnection();
    if (!this.pc) throw new Error("PeerConnection not initialized");

    this.dataChannel = this.pc.createDataChannel('gameData');
    this.setupDataChannelEvents();

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    return this.waitForIceGathering();
  }

  public async createAnswer(offerString: string): Promise<string> {
    this.initializePeerConnection();
    if (!this.pc) throw new Error("PeerConnection not initialized");

    this.pc.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannelEvents();
    };

    let offer;
    try {
        offer = JSON.parse(atob(offerString));
    } catch(e) {
        console.error("Failed to decode offer string:", e);
        throw new Error("The provided offer code is not valid.");
    }

    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    return this.waitForIceGathering();
  }

  public async acceptAnswer(answerString: string): Promise<void> {
    if (!this.pc) throw new Error("PeerConnection not initialized");
    
    let answer;
    try {
        answer = JSON.parse(atob(answerString));
    } catch(e) {
        console.error("Failed to decode answer string:", e);
        throw new Error("The provided answer code is not valid.");
    }
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  private setupDataChannelEvents() {
    if (!this.dataChannel) return;
    this.dataChannel.onopen = () => {
        console.log("Data channel is open");
        // This is the true signal that the connection is ready for the app.
        if (this.onConnectionStateChange) {
            this.onConnectionStateChange('connected');
        }
    };
    this.dataChannel.onmessage = (event) => {
      if (this.onData) {
        this.onData(JSON.parse(event.data));
      }
    };
    this.dataChannel.onclose = () => {
        console.log("Data channel is closed");
         if (this.pc && this.onConnectionStateChange) {
            this.onConnectionStateChange('disconnected');
        }
    };
  }

  public send(message: P2PMessage): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(message));
    } else {
        console.error("Data channel is not open. Cannot send message.");
    }
  }

  public close(): void {
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    if (this.pc) {
      this.pc.close();
    }
    this.pc = null;
    this.dataChannel = null;
  }
}