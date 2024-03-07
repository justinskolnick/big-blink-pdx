import React, { useEffect, useRef } from 'react';

const Loading = () => {
  const timedOut = useRef(false);

  useEffect(() => {
    if (!timedOut.current) {
      setTimeout(() => {
        timedOut.current = true;
      }, 250);
    }
  }, [timedOut]);

  if (!timedOut.current) return null;

  return (
    <div className='loading'>...</div>
  );
};

export default Loading;
