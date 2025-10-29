import React, { useEffect, useState } from 'react';

const SimpleCountdown = ({ show, totalTime, digits, onComplete }: Props) => {
  const [time, setTime] = useState(totalTime);

  useEffect(() => {
    if(show) {
      setTime(totalTime);
      tick(totalTime);
    }
  }, [show]);
  
  const tick = (t: number) => {
    setTimeout(() => {
      if(t > 1){
        setTime(t - 1);
        tick(t - 1);
      }
      else {
        onComplete();
      }
    }, 1000)
  }
  
  if(show) {
    return (
      <span>{time.toString().padStart(digits, '0')}</span>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  digits: number,
  totalTime: number,
  onComplete: () => void
}

export default SimpleCountdown;