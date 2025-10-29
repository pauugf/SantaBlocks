import React from 'react';

const SmallBox = ({ children, type, left, top }: Props) => {
  return (
    <div className={ 'smallBox ' + type } style={{ left: left, top: top }}>
      {children}
    </div>
  );
}

interface Props {
  children?: JSX.Element,
  type: string,
  left: number,
  top: number
}

export default SmallBox;