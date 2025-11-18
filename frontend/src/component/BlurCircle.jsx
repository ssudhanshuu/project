// BlurCircle.jsx
import React from 'react';

const BlurCircle = ({ top = '0', right = '0', left, bottom }) => {
  return (
    <div
      className="absolute w-[300px] h-[300px] rounded-full bg-[#ffffff1a] blur-[120px] z-0"
      style={{ top, right, left, bottom }}
    />
  );
};

export default BlurCircle;
