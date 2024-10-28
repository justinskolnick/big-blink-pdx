import React, { ReactNode } from 'react';

import DateBox from './incident-date-box';
import IncidentStatGroup from './incident-stat-group';
import IncidentCountBox from './stat-box-incident-count';
import ItemSubhead from './item-subhead';
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
          <ItemSubhead subtitle='Totals' icon='chart-line' />

          <IncidentCountBox
            onClick={scrollToRef}
            title='Incident count'
          >
            {incidents.stats.total}
          </IncidentCountBox>
          <IncidentCountBox title='Share of total'>
            {incidents.stats.percentage}%
          </IncidentCountBox>
        </NumbersGroup>

        <IncidentStatGroup className='activity-dates'>
          <ItemSubhead subtitle='Appearances' icon='calendar' />

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
