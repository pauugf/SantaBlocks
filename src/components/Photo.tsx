import React, { useEffect } from 'react';
import gsap from 'gsap';

const Photo = ({ show, image, scale, initialTop, finalTop }: Props) => {
  const ref = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if(show) {
      gsap.set(ref.current, {
        css: { scale: scale, top: initialTop, rotation: 60 }
      });
      gsap.to(ref.current, { rotation: 0, top: finalTop, duration: 1 });
    }
  }, [show]);

  if(show) {
    return (
      <div ref={ref} className="photo">
        <img src={image} />
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  image: string,
  scale: number,
  initialTop: number,
  finalTop: number
}

export default Photo;