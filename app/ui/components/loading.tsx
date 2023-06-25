import React, { useEffect, useRef } from 'react';
import { cx, css } from '@emotion/css';

const styles = css`
  padding: 18px 0;
  color: var(--color-dull);
  font-size: 18px;
  text-align: center;
`;

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
    <div className={cx('loading', styles)}>...</div>
  );
};

export default Loading;
