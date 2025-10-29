import React, { useEffect, useState } from 'react';

const Countdown = ({ show, totalTime, onComplete }: Props) => {
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
      <div className="countdown">
        <span className="small">{time}</span>
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  totalTime: number,
  onComplete: () => void
}

export default Countdown;