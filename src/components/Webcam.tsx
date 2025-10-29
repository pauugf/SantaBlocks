import React, { useEffect } from 'react';
import broox from '../../modules/broox';

const Webcam = ({ webcamId, webcamName, webcamWidth, webcamHeight }: Props) => {
  const ref = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    broox.media.getAvailableDevices().then((d: any) => console.log(d));
    getStream().then((stream: any) => {
      if(ref.current) {
        console.log('Starting webcam');
        ref.current.srcObject = stream;
      }
    });
  }, []);

  // get stream from id if defined or name otherwise
  const getStream = async (): Promise<MediaStream> => {
    if(webcamId) {
      return await broox.media.startDevice(webcamId, webcamWidth, webcamHeight);
    }
    else {
      const id = await broox.media.getDeviceId(webcamName);
      console.log('Webcam id', id);
      return await broox.media.startDevice(id, webcamWidth, webcamHeight);
    }
  }

  return (
    <video ref={ref} id="webcam" className="webcam" autoPlay={true}></video>
  );
}

interface Props {
  webcamId?: string,
  webcamName: string,
  webcamWidth: number,
  webcamHeight: number
}

export default Webcam;