import React, { ReactNode } from 'react';

import { scrollToRef } from '../lib/dom';

import DateBox from './incident-date-box';
import IncidentActivityChart from './incident-activity-chart';
import IncidentStatGroup from './incident-stat-group';
import ItemSubhead from './item-subhead';
import NumbersGroup from './stat-group-numbers';
import StatBox from './stat-box';
import StatGroup from './stat-group';
import StatSection from './stat-section';

import type { ItemOverview } from '../types';

interface Props {
  children: ReactNode;
  overview?: ItemOverview;
  ref: React.RefObject<HTMLElement>;
}

const ActivityOverview = ({
  children,
  overview,
  ref,
}: Props) => {
  const hasOverview = Boolean(overview);

  const hasAppearances = Object.values(overview?.appearances?.values ?? {})?.some(value => value.value);
  const hasTotals = Object.values(overview?.totals?.values ?? {})?.some(value => value.value);

  const scrollToIncidents = () => scrollToRef(ref);

  if (!hasOverview) return null;

  return (
    <div className='activity-overview'>
      {hasOverview && (
        <StatSection title={overview.label} stylized={false}>
          <StatGroup className='activity-numbers-and-dates'>
            {hasTotals && (
              <NumbersGroup>
                <ItemSubhead
                  subtitle={overview.totals.label}
                  icon='chart-line'
                />

                {Object.values(overview.totals.values).map(item => {
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

            {hasAppearances && (
              <IncidentStatGroup className='activity-dates'>
                <ItemSubhead
                  subtitle={overview.appearances.label}
                  icon='calendar'
                />

                {Object.values(overview.appearances.values).map(item => (
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
