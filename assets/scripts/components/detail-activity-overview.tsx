import React, { ReactNode } from 'react';

import { scrollToRef } from '../lib/dom';

import ActivityHeader from './detail-activity-header';
import ActivitySubhead from './detail-activity-subhead';
import DateBox from './incident-date-box';
import IncidentActivityChart from './incident-activity-chart';
import IncidentStatGroup from './incident-stat-group';
import NumbersGroup from './stat-group-numbers';
import StatBox from './stat-box';
import StatGroup from './stat-group';
import StatSection from './stat-section';

import type {
  ItemOverview,
  Ref,
} from '../types';

interface Props {
  children: ReactNode;
  overview?: ItemOverview;
  ref?: Ref;
}

const ActivityOverview = ({
  children,
  overview,
  ref,
}: Props) => {
  const hasOverview = overview !== undefined;

  const hasAppearances = overview?.appearances !== undefined;
  const hasTotals = overview?.appearances !== undefined;

  const appearancesValues = overview?.appearances?.values ? Object.values(overview.appearances.values) : [];
  const totalsValues = overview?.totals?.values ? Object.values(overview?.totals?.values ?? {}) : [];

  const hasAppearancesValues = appearancesValues.some(value => value.value);
  const hasTotalsValues = totalsValues.some(value => value.value);

  const scrollToIncidents = () => ref && scrollToRef(ref);

  return (
    <div className='activity-overview'>
      {hasOverview && (
        <StatSection>
          <ActivityHeader title={overview.label} />

          <StatGroup className='activity-numbers-and-dates'>
            {hasTotals && hasTotalsValues && (
              <NumbersGroup>
                <ActivitySubhead
                  title={overview.totals?.label ?? ''}
                  icon='chart-line'
                />

                {totalsValues.map(item => {
                  const isInteractive = item.key === 'total';

                  return (
                    <StatBox
                      key={item.key}
                      className={isInteractive && 'is-interactive'}
                      onClick={isInteractive ? scrollToIncidents : undefined}
                      title={item.label}
                    >
                      {item.value}
                    </StatBox>
                  );
                })}
              </NumbersGroup>
            )}

            {hasAppearances && hasAppearancesValues && (
              <IncidentStatGroup className='activity-dates'>
                <ActivitySubhead
                  title={overview.appearances?.label ?? ''}
                  icon='calendar'
                />

                {appearancesValues.map(item => (
                  <DateBox key={item.key} incident={item} />
                ))}
              </IncidentStatGroup>
            )}
          </StatGroup>
        </StatSection>
      )}

      <StatSection stylized={false}>
        {hasOverview && (
          <IncidentActivityChart>
            {hasTotals ? children : (
              <p>No data is available to display.</p>
            )}
          </IncidentActivityChart>
        )}
      </StatSection>
    </div>
  );
};

export default ActivityOverview;
