import React, { ReactNode } from 'react';

import DateBox from './incident-date-box';
import IncidentActivityChart from './incident-activity-chart';
import IncidentStatGroup from './incident-stat-group';
import ItemSubhead from './item-subhead';
import NumbersGroup from './stat-group-numbers';
import StatBox from './stat-box';
import StatGroup from './stat-group';
import StatSection from './stat-section';

import type { IncidentsOverview } from '../types';

interface Props {
  children: ReactNode;
  incidents?: IncidentsOverview;
  ref: React.RefObject<HTMLElement>;
}

const ActivityOverview = ({
  children,
  incidents,
  ref,
}: Props) => {
  const stats = incidents?.stats;
  const hasStats = Boolean(stats);
  const hasAppearances = stats?.appearances?.values.some(value => value.value);
  const hasIncidents = Boolean(stats?.totals?.values.total.value);

  const scrollToRef = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='activity-overview'>
      {hasStats && (
        <StatSection title={stats.label} stylized={false}>
          <StatGroup className='activity-numbers-and-dates'>
            <NumbersGroup>
              <ItemSubhead
                subtitle={stats.totals.label}
                icon='chart-line'
              />

              {Object.values(stats.totals.values).map(item => {
                const isInteractive = item.key === 'total';

                return (
                  <StatBox
                    key={item.key}
                    className={isInteractive && 'is-interactive'}
                    onClick={isInteractive ? scrollToRef : undefined}
                    title={item.label}
                  >
                    {item.value}
                  </StatBox>
                );
              })}
            </NumbersGroup>

            {hasAppearances && (
              <IncidentStatGroup className='activity-dates'>
                <ItemSubhead
                  subtitle={stats.appearances.label}
                  icon='calendar'
                />

                {stats.appearances.values.map(item => (
                  <DateBox key={item.key} incident={item} />
                ))}
              </IncidentStatGroup>
            )}
          </StatGroup>
        </StatSection>
      )}

      <StatSection stylized={false}>
        {hasStats && (
          <IncidentActivityChart>
            {hasIncidents ? children : (
              <p>No data is available to display.</p>
            )}
          </IncidentActivityChart>
        )}
      </StatSection>
    </div>
  );
};

export default ActivityOverview;
