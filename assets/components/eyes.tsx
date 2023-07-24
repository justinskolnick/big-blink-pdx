import React from 'react';
import { cx, css } from '@emotion/css';

import Icon from './icon';

const styles = css`
  display: flex;
  scale: 1 1;

  .icon {
    flex-grow: 0;
    flex-shrink: 0;
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
    <Icon name='eye' />
    <Icon name='eye' />
    <Icon name='eye' />
  </div>
);

export default Eyes;
