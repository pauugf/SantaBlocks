import { readPacket } from 'osc';

/**
 * OSC client
 */
export class OscClient {
  private connection: RTCPeerConnection;
  private startTime = 0;
  private dataChannelInterval = null;
  private channel: string = '';
  private onMessageCallback: (message: any) => void;

  /**
   * Initializes a new instance of the OscClient class.
   * @param WebRTC channel.
   */
  constructor(channel: string) {
    this.channel = channel;
    const config = { 
      sdpSemantics: 'unified-plan',
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] 
    };
    this.connection = new RTCPeerConnection(config);
  }

  /**
   * Connects to the OSC server.
   */
  connect() {
    const parameters = { ordered: true };
    const dataChannel = this.connection.createDataChannel('chat', parameters);
    dataChannel.addEventListener('close', () => {
      clearInterval(this.dataChannelInterval);
    });
    dataChannel.addEventListener('open', () => {
      // this.dataChannelInterval = setInterval(() => {
      //   const message = 'ping ' + this.getCurrentStamp();
      //   dataChannel.send(message);
      // }, 1000);
    });
    dataChannel.addEventListener('message', (event) => {
      if(navigator.userAgent.includes('Firefox')) {
        event.data.arrayBuffer().then((buffer) => {
          const message = readPacket(buffer, { metadata: true });
          this.onMessageCallback && this.onMessageCallback(message.packets);
        });
      }
      else {
        const message = readPacket(event.data, { metadata: true });
        this.onMessageCallback && this.onMessageCallback(message.packets);
      }
    });
    const constraints = {
      audio: false,
      video: false
    };
    this.negotiate();
  }

  /**
   * Sets the callback function that fires when a message is recieved.
   * @param callback Callback fired when a new message is recieved.
   */
  onMessage(callback: (message: any) => void) {
    this.onMessageCallback = callback;
  }

  private getCurrentStamp() {
    if(this.startTime === null) {
      this.startTime = new Date().getTime();
      return 0;
    }
    else {
      return new Date().getTime() - this.startTime;
    }
  };

  private negotiate() {
    return this.connection.createOffer().then((offer) => {
      return this.connection.setLocalDescription(offer);
    }).then(() => {
      // wait for ICE gathering to complete
      return new Promise((resolve) => {
        if(this.connection.iceGatheringState === 'complete') {
          resolve();
        }
        else {
          const checkState = () => {
            if(this.connection.iceGatheringState === 'complete') {
              this.connection.removeEventListener('icegatheringstatechange', checkState);
              resolve();
            }
          };
          this.connection.addEventListener('icegatheringstatechange', checkState);
        }
      });
    }).then(() => {
      const offer = this.connection.localDescription;
      const options = {
        body: JSON.stringify({ sdp: offer.sdp, type: offer.type, video_transform: 'none' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      };
      return fetch(this.channel, options);
    }).then((response) => {
      return response.json();
    }).then((answer) => {
      return this.connection.setRemoteDescription(answer);
    }).catch(error => {
      alert(error);
    });
  }
}