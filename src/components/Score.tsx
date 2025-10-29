import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import contestConfig from '../config/contest.json';

const Score = ({ show, value, onComplete }: Props) => {
  const [prize, setPrize] = useState<any>(null);
  const [showPrize, setShowPrize] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const prizeRef = useRef(prize);

  useEffect(() => {
    if(show) {
      setPrize({ SKU: 'NOPRIZE'});
      setShowPrize(false);
      console.log('showing score');
      if(value !== 0) {
        fetch(contestConfig.rollService)
          .then(response => {
            return response.json();
          })
          .then(response => {
            if(response && response.SKU !== 'NOPRIZE') {
              setPrize(response);
              setTimeout(() => {
                setShowPrize(true);
                close();
              }, 4000);
            }
            else {
              close();
            }
          });
      }
      else {
        close();
      }
      const container = ref.current;
      if(container) {
        gsap.set(container, { css: { top: -493, display: 'block', opacity: 0 }});
        gsap.to(container, { top: 'calc(50% - 246px)',  duration: 2, opacity: 1 });
      }
    }
  }, [ show ]);

  useEffect(() => {
    prizeRef.current = prize;
  }, [ prize ]);

  const close = () => {
    setTimeout(() => {
      gsap.to(ref.current, { top: -493,  duration: 2, opacity: 0, onComplete: () => {
        onComplete(prizeRef.current);
      }});
    }, 5000);
  }

  if(show) {
    return (
      <div className="box" ref={ref}>
        <div>
          <div style={{ display: showPrize ? 'none' : 'block' }}>
            <div style={{ fontSize: '44px', color: '#1a1e3b' }}>¡Fantástico!</div>
            <div style={{ fontSize: '70px', marginTop: '30px', color: '#009fca' }}>{value} <span style={{ fontSize: '44px' }}>puntos</span></div>
            <div style={{ fontSize: '37px', fontFamily: 'Calibri', marginTop: '30px', color: '#35384e' }}>Has ayudado a sumar <span style={{ fontFamily: 'Dax-Bold Regular', fontWeight: 'bold' }}>1kg</span> de comida solidaria</div>
          </div>
          <div  style={{ display: showPrize ? 'block' : 'none' }}>
            <div style={{ color: '#35384e' }}>
              <div style={{ fontSize: '44px', fontFamily: 'Calibri' }}>Has ganado</div>
              <div style={{ fontSize: '46px', marginTop: '30px' }}>{prize && prize.name}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  value: number
  onComplete: (prize: any) => void
}

export { Score };