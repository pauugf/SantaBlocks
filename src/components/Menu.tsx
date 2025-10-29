import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Content } from '../model/Model.module';

const Menu = ({ show, options, gesture, onChange }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(false);
  const [moving, setMoving] = useState(false);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.log('gesture', gesture);
    if(gesture) {
      if(gesture === 'left') {
        moveLeft();
      }
      else if(gesture === 'right') {
        moveRight();
      }
      if(gesture === 'both') {
        select();
      }
    }
  }, [gesture]);

  const select = () => {
    if(show && !selected) {
      console.log('select');
      setSelected(true);
      setTimeout(() => {
        onChange(currentIndex);
        setSelected(false);
      }, 3000);
    }
  }

  const moveLeft = () => {
    if(show && options.length && !selected && !moving) {
      console.log('moveLeft');
      if(currentIndex === 0) {
        setCurrent(options.length - 1);
      }
      else {
        setCurrent(currentIndex - 1);
      }
    }
  }

  const moveRight = () => {
    if(show && options.length && !selected && !moving) {
      console.log('moveRight');
      if(currentIndex === options.length - 1) {
        setCurrent(0);
      }
      else {
        setCurrent(currentIndex + 1);
      }
    }
  }

  const setCurrent = (index: number) => {
    if(imageRef.current) {
      setMoving(true);
      gsap.set(imageRef.current, { opacity: 1 });
      gsap.to(imageRef.current, { opacity: 0, onComplete: () => {
        gsap.set(imageRef.current, { opacity: 0 });
        console.log('move to index:', index);
        setMoving(false);
        setCurrentIndex(index);
        gsap.to(imageRef.current, { opacity: 1 });
      }});
    }
  }

  if(show) {
    return (
      <div className="menu">
        {!selected && <div className="header">Select your characters or filters</div>}
        {options.length && 
          <div onClick={select} className="info">
            <img ref={imageRef} src={options[currentIndex].image.url} style={{ opacity: selected ? 0.6 : 1 }} />
          </div>}
        {!selected && <>
          <div onClick={moveLeft} className="arrow left"></div>
          <div onClick={moveRight} className="arrow right"></div>
          <div className="confirm">CONFIRM</div>
        </>}
        {selected && <div className="selected">NICE CHOICE!</div>}
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  options: Content[],
  gesture: string,
  onChange: (index: number) => void
}

export default Menu;