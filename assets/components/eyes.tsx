import React from 'react';
import { cx, css } from '@emotion/css';

import Eye from '../icons/eye';

const styles = css`
  display: flex;
  column-count: 3;
  scale: 1 1;

  .icon {
    transform: scale(1, 1);
  }

  @keyframes blink {
    0% {
      scale: 1 1;
    }
    40% {
      scale: 1 1;
      animation-timing-function: ease-in;
    }
    55% {
      scale: 1 0.25;
    }
    70% {
      scale: 1 1;
      animation-timing-function: ease-in;
    }
    85% {
      scale: 1 0.25;
    }
    100% {
      scale: 1 1;
      animation-timing-function: ease-out;
    }
  }
`;

const Eyes = () => (
  <div className={cx('eyes', styles)}>
    <Eye />
    <Eye />
    <Eye />
  </div>
);

export default Eyes;
