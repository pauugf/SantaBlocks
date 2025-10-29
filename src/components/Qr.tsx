import React, { useEffect } from 'react';
import QRCode from 'qrcode';

const Qr = ({ url, show, top, left, width }: Props) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(show) {
      QRCode.toCanvas(ref.current, url, { width: width }, (error: any) => {
        if(error) {
          console.log('Error generating QR');
        }
        console.log('QR generated');
      });
    }
  }, [show]);

  if(show) {
    return (
      <canvas ref={ref} className="qr" style={{ top: top || 0, left: left || 0 }}></canvas>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  url: string,
  top?: number,
  left?: number,
  width: number
}

export default Qr;