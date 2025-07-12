import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { delayedScrollToRef } from '../../lib/dom';
import { hasQuarterSearchParam } from '../../lib/params';

import Chart from './chart';
import Leaderboard from './leaderboard';
import Section from '../section';

const Home = () => {
  const ref = useRef(null);

  const [searchParams] = useSearchParams();
  const hasQuarterParam = hasQuarterSearchParam(searchParams);

  useEffect(() => {
    const hasRef = Boolean(ref?.current);

    if (hasQuarterParam && hasRef) {
      delayedScrollToRef(ref);
    }
  }, [hasQuarterParam, ref]);

  return (
    <Section
      icon='handshake'
      title='Lobbying in Portland, Oregon'
      className='section-home'
    >
      <Chart />
      <Leaderboard ref={ref} />
    </Section>
  );
};

export default Home;
