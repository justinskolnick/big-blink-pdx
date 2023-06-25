import React from 'react';
import { css } from '@emotion/css';

import IncidentCountBox from './stat-box-incident-count';

import { ChildContainerProps } from '../types';

interface IncidentTotalBoxProps extends ChildContainerProps {
  onClick: () => void;
}

const styles = css`
  cursor: pointer;
  transition: box-shadow 250ms ease,
              transform 250ms ease;

  &:hover {
    box-shadow: 0 1px 4px var(--color-accent-alt-lighter);
    transform: scale(1.05);
    transition-timing-function: cubic-bezier(0.32, 2, 0.55, 0.27);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const IncidentTotalBox = ({
  children,
  onClick,
}: IncidentTotalBoxProps) => (
  <IncidentCountBox
    onClick={onClick}
    title='Incidents'
    className={styles}
  >
    {children}
  </IncidentCountBox>
);

export const IncidentShareBox = ({
  children,
}: ChildContainerProps) => (
  <IncidentCountBox title='Percent of total'>
    {children}
  </IncidentCountBox>
);
