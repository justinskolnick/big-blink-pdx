import React from 'react';
import { useSelector } from 'react-redux';

import Icon from '../icon';
import ItemChart from '../item-chart';
import ItemSubhead from '../item-subhead';
import LeaderboardSubsection from '../leaderboard/subsection';
import LeaderboardSubsectionGroup from '../leaderboard/subsection-group';

import { getSourcesDataForChart } from '../../selectors';

const Chart = () => {
  const sources = useSelector(getSourcesDataForChart);
  const data = sources?.data;
  const lineProps = {
    data,
  };

  return (
    <LeaderboardSubsection>
      <LeaderboardSubsectionGroup>
        <ItemSubhead subtitle={(
          <>
            <Icon name='chart-simple' />
            <span className='item-text'>
              Lobbying activity over time
            </span>
          </>
        )} />

        <ItemChart lineProps={lineProps} />
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default Chart;