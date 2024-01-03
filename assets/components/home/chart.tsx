import React from 'react';
import { useSelector } from 'react-redux';

import ItemChart from '../item-chart';
import ItemSubhead from '../item-subhead';
import ItemTextWithIcon from '../item-text-with-icon';
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
          <ItemTextWithIcon icon='chart-simple'>
            Lobbying activity over time
          </ItemTextWithIcon>
        )} />

        <ItemChart lineProps={lineProps} />
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default Chart;
