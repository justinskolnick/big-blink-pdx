import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

const styles = css`
  & + & {
    margin-top: calc(3 * var(--gap));
  }

  @media screen and (min-width: 813px) {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: calc(2 * var(--gap));
  }
`;

interface Props {
  children: ReactNode;
}

const LeaderboardSubsection = ({ children }: Props) => (
  <section className={cx('leaderboard-subsection', styles)}>
    {children}
  </section>
);

export default LeaderboardSubsection;
