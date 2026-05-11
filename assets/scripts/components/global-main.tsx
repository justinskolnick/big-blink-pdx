import { useEffect, ReactNode } from 'react';

import Section from './section';

import api from '../services/api';

interface Props {
  children: ReactNode;
}

const Main = ({ children }: Props) => {
  const [triggerOverview, overviewResult] = api.useLazyGetOverviewQuery();

  useEffect(() => {
    if (overviewResult.isUninitialized) {
      triggerOverview(null);
    }
  }, [
    overviewResult,
    triggerOverview,
  ]);

  return (
    <main className='global-main'>
      <Section
        icon='handshake'
        title='Lobbying in Portland, Oregon'
      >
        {children}
      </Section>
    </main>
  );
};

export default Main;
