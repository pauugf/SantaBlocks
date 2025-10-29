import React, { useEffect } from 'react';
import gsap from 'gsap';
import QRCode from 'qrcode';

const AnimatedQr = ({ url, show, initialTop, finalTop, width }: Props) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(show) {
      gsap.set(ref.current, { css: { x: -Math.round(width / 2), y: initialTop }});
      QRCode.toCanvas(ref.current, url, { width: width }, (error: any) => {
        if(error) {
          console.log('Error generating QR');
        }
        console.log('QR generated');
        gsap.to(ref.current, { x: -Math.round(width / 2), y: finalTop, duration: 1 });
      });
    }
  }, [show]);

  if(show) {
    return (
      <canvas ref={ref} className="qr"></canvas>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  url: string,
  initialTop: number,
  finalTop: number,
  width: number
}

export default AnimatedQr;