import React, { ReactNode } from 'react';

import DateBox from './incident-date-box';
import IncidentStatGroup from './incident-stat-group';
import IncidentCountBox from './stat-box-incident-count';
import NumbersGroup from './stat-group-numbers';
import StatGroup from './stat-group';
import StatSection from './stat-section';

import type { IncidentsOverview } from '../types';

interface Props {
  children: ReactNode;
  incidents: IncidentsOverview;
  scrollToRef: () => void;
}

const ActivityOverview = ({
  children,
  incidents,
  scrollToRef,
}: Props) => (
  <div className='activity-overview'>
    <StatSection title='Overview' stylized={false}>
      <StatGroup className='activity-numbers-and-dates'>
        <NumbersGroup>
          <IncidentCountBox title='Percent of total'>
            {incidents.stats.percentage}%
          </IncidentCountBox>
          <IncidentCountBox
            onClick={scrollToRef}
            title='Incidents'
            className='activity-stat-action'
          >
            {incidents.stats.total}
          </IncidentCountBox>
        </NumbersGroup>

        <IncidentStatGroup className='activity-dates'>
          <DateBox incident={incidents.stats.first} />
          <DateBox incident={incidents.stats.last} />
        </IncidentStatGroup>
      </StatGroup>
    </StatSection>

    <StatSection stylized={false}>
      {children}
    </StatSection>
  </div>
);

export default ActivityOverview;
