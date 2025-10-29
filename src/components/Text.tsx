import React from 'react';

const Text = ({ show, value, width, top, left, fontSize, color }: Props) => {
  if(show) {
    return (
      <div className="text" style={{ fontSize: fontSize, color: color, width: width || '100%', top: top || 0, left: left || 0 }}>{value}</div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  value: string,
  width?: number,
  top?: number,
  left?: number,
  fontSize: string,
  color: string
}

export default Text;