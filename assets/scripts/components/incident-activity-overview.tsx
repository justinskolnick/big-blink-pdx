import React, { ReactNode } from 'react';

import DateBox from './incident-date-box';
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
  scrollToRef: () => void;
}

const ActivityOverview = ({
  children,
  incidents,
  scrollToRef,
}: Props) => {
  const hasIncidents = Boolean(incidents);
  const hasAppearances = Boolean(incidents?.stats.appearances);

  return (
    <div className='activity-overview'>
      {hasIncidents && (
        <StatSection title={incidents.stats.label} stylized={false}>
          <StatGroup className='activity-numbers-and-dates'>
            <NumbersGroup>
              <ItemSubhead
                subtitle={incidents.stats.totals.label}
                icon='chart-line'
              />

              {Object.values(incidents.stats.totals.values).map(item => {
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
                  subtitle={incidents.stats.appearances.label}
                  icon='calendar'
                />

                {incidents.stats.appearances.values.map(item => (
                  <DateBox key={item.key} incident={item} />
                ))}
              </IncidentStatGroup>
            )}
          </StatGroup>
        </StatSection>
      )}

      <StatSection stylized={false}>
        {children}
      </StatSection>
    </div>
  );
};

export default ActivityOverview;
