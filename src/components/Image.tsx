import React, { useEffect, useRef, useState } from 'react';
import { MediaSettings } from '../model/MediaSettings';

const BackgroundImage = ({ src, show, settings, onSetElement }: Props) => {
  const ref = useRef<HTMLImageElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [imageSettings, setImageSettings] = useState<MediaSettings>(settings)

  useEffect(() => {
    setImageSettings(settings);
  }, [settings]);

  useEffect(() => {
    const image = ref.current;
    if(show && src && image) {
      const i = new Image();
      i.onload = () => {
        onSetElement && onSetElement(image);
        setWidth(i.width);
        setHeight(i.height);
        image.src = src;
      };
      i.src = src;
    }
  }, [show]);

  const scale = imageSettings.scale || 1;
  const left = imageSettings.left ? (imageSettings.left * scale) + 'px' : 0;
  const top = imageSettings.top ? (imageSettings.top * scale) + 'px' : 0;
  const styles = {
    display: show ? 'block': 'none',
    left: left,
    top: top,
    width: settings.width || (width * scale),
    height: settings.height || (height * scale)
  };
  return (
    <img ref={ref} className="backgroundImage" style={styles} />
  );
}

interface Props {
  src: string,
  show: boolean,
  settings: MediaSettings,
  onSetElement?: (element: HTMLImageElement) => void
}

export default BackgroundImage;