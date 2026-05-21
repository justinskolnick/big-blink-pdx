import { useEffect, ReactNode } from 'react';

import Section from './section';

import api from '../services/api';

interface Props {
  children: ReactNode;
}

const Main = ({ children }: Props) => {
  const [triggerOverview, overviewResult] = api.useLazyGetOverviewQuery();
  const [triggerUi, uiResult] = api.useLazyGetUiQuery();

  useEffect(() => {
    if (overviewResult.isUninitialized) {
      triggerOverview(null);
    }
    if (uiResult.isUninitialized) {
      triggerUi(null);
    }
  }, [
    overviewResult,
    triggerOverview,
    triggerUi,
    uiResult,
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
