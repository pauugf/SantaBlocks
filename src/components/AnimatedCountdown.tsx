import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const AnimatedCountdown = ({ show, totalTime, endTime, onComplete }: Props) => {
  const [time, setTime] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const smallRef = useRef<HTMLSpanElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(show) {
      start();
    }
  }, [show]);

  const showTime = (t: number) => {
    setTime(t - 1);
    if(t === 0) {
      flash();
      return;
    }
    else if(t <= endTime + 1) {
      const number = numberRef.current;
      if(number) {
        gsap.to(number, { duration: 0.4, opacity: 0.0, scale: 0.3, onComplete: () => {
          if(t - 1 > 0) {
            number.innerHTML = (t - 1).toString();
            gsap.set(number, { opacity: 0.0, scale: 0.6 });
            gsap.to(number, { duration: 0.3, opacity: 1.0 });
            gsap.to(number, { duration: 0.4, scale: 1.0, ease: 'elastic' });
          }
        }});
      }
    }
    setTimeout(() => {
      showTime(t - 1);
    }, 1000)
  }
  const start = () => {
    gsap.set(flash, { opacity: 0.0 });
    gsap.set(numberRef, { opacity: 0.0 });
    gsap.set(smallRef, { opacity: 1.0 });
    setTime(totalTime);
    showTime(totalTime);
  };
  const flash = () => {
    gsap.to(flashRef.current, { opacity: 1.0, onComplete: () => {
      onComplete && onComplete();
      gsap.to(flashRef.current, { opacity: 0.0 });
    }});
  }
  return show ? (
    <div ref={ref} className="countdown">
      {time <= endTime && <span ref={numberRef} className="big"></span>}
      {time > endTime && <span ref={smallRef} className="small">{time}</span>}
      <div ref={flashRef} className="flash"></div>
    </div>
  ) : null;
}

interface Props {
  show: boolean,
  totalTime: number,
  endTime: number,
  onComplete: () => void
}

export default AnimatedCountdown;