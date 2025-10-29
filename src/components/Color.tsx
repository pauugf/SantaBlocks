import React from 'react';

const Color = ({ show, color, width, height, top, left }: Props) => {
  return (
    <div className="backgroundColor" style={{ display: show ? 'block' : 'none', backgroundColor: color, width: width || '100%', height: height || '100%', top: top || 0, left: left || 0 }} />
  );
}

interface Props {
  show: boolean,
  color: string,
  width?: number,
  height?: number,
  top?: number,
  left?: number
}

export default Color