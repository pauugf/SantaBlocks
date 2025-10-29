import React, { CSSProperties, useEffect, useState } from 'react';
import { MediaSettings } from '../model/MediaSettings';

const MediaEdition = ({ show, settings, onChange, onFinish }: Props) => {
  const [left, setLeft] = useState(settings ? settings.left : 0);
  const [top, setTop] = useState(settings ? settings.top : 0);
  const [scale, setScale] = useState(settings ? settings.scale : 1);

  useEffect(() => {
    console.log('settings changed', settings);
    setLeft(settings?.left || 0);
    setTop(settings?.top || 0);
    setScale(settings?.scale || 1);
  }, [settings]);

  const onChangeScale = (e: any) => {
    setScale(e.target.value);
  }

  const onChangeLeft = (e: any) => {
    setLeft(e.target.value);
  }

  const onChangeTop = (e: any) => {
    setTop(e.target.value);
  }

  const onSet = () => {
    settings.left = left;
    settings.top = top;
    settings.scale = scale;
    onChange(settings);
  }

  if(show) {
    const style: CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundColor: '#FFFFFF',
      padding: '50px',
      fontSize: '30px'
    };
    const inputStyle: CSSProperties = {
      lineHeight: '30px',
      fontSize: '30px',
      border: '1px solid black',
      marginTop: '10px',
      marginBottom: '20px'
    };
    const buttonStyle: CSSProperties = {
      fontSize: '30px',
      backgroundColor: 'white',
      border: '1px solid black',
      textTransform: 'uppercase',
      paddingLeft: '20px',
      paddingRight: '20px'
    };
    const leftStyle: CSSProperties = {
      float: 'left'
    };
    const rightStyle: CSSProperties = {
      float: 'right'
    };
    return (
      <div style={style} className="mediaEdition">
        <div>Scale</div>
        <div>
          <input type="number" value={scale} style={inputStyle} onChange={onChangeScale}></input>
        </div>
        <div>Left</div>
        <div>
          <input type="text" value={left} style={inputStyle} onChange={onChangeLeft}></input>
        </div>
        <div>Top</div>
        <div>
          <input type="text" value={top} style={inputStyle} onChange={onChangeTop}></input>
        </div>
        <div>
          <button style={{ ...buttonStyle, ...leftStyle }} onClick={onFinish}>FINISH</button>
          <button style={{ ...buttonStyle, ...rightStyle }} onClick={onSet}>SET</button>
        </div>
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  settings: MediaSettings,
  onChange: (settings: MediaSettings) => void,
  onFinish: () => void
}

export { MediaEdition };