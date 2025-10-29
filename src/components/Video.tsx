import React, { useEffect, useState } from 'react';
import { MediaSettings } from '../model/MediaSettings';

const Video = ({ show, id, src, settings, loop, time, onEnd, onSetElement }: Props) => {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [videoSettings, setVideoSettings] = useState<MediaSettings>(settings);

  useEffect(() => {
    setVideoSettings(settings);
  }, [settings]);

  useEffect(() => {
    const video = ref.current;
    if(show && src && video) {
      video.loop = loop || false;
      video.src = src;
      video.load();
      video.addEventListener('loadeddata', (e) => {
        onSetElement && onSetElement(video);
        setWidth(video.videoWidth);
        setHeight(video.videoHeight);
        video.muted = true;
        video.play();
      });
      if(!time) {
        video.addEventListener('ended', () => {
          onEnd && onEnd();
        });
      }
      else {
        setTimeout(() => {
          onEnd && onEnd();
        }, time * 1000);
      }
    }
  }, [show]);

  const scale = videoSettings.scale || 1;
  const left = videoSettings.left ? (videoSettings.left * scale) + 'px' : 0;
  const top = videoSettings.top ? (videoSettings.top * scale) + 'px' : 0;
  const styles = {
    display: show ? 'block': 'none',
    left: left,
    top: top,
    width: width * scale,
    height: height * scale
  };
  return (
    <video id={id} ref={ref} className="video" style={styles} />
  );
}

interface Props {
  show: boolean,
  id: string,
  src: string,
  settings: MediaSettings,
  loop?: boolean,
  time?: number,
  onEnd?: () => void,
  onSetElement?: (element: HTMLVideoElement) => void
}
  
export default Video;