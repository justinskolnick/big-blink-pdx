import React from 'react';

import IncidentQuarterlyActivityChart from './incident-activity-chart-quarterly';
import { LineProps } from './item-chart';

import useSelector from '../hooks/use-app-selector';

import {
  getSourcesChartIds,
  getStatsLabels,
  getTotalFromSourceIds,
} from '../selectors';

import type {
  Ids,
  StatsObject,
} from '../types';

interface Props {
  label?: string;
  stats?: StatsObject;
}

const getIndexedEntriesAndEstimates = (sourceIds: Ids, stats?: StatsObject) => ({
  entries: getTotalFromSourceIds(sourceIds, stats?.entries),
  estimates: getTotalFromSourceIds(sourceIds, stats?.estimates),
});

const Chart = ({ label, stats }: Props) => {
  const labels = useSelector(getStatsLabels);

  const sourceIds = useSelector(getSourcesChartIds);
  const itemChartData = getIndexedEntriesAndEstimates(sourceIds, stats);

  const lineProps: LineProps = {
    entries: {
      data: itemChartData?.entries,
      label: label || labels.entries,
    },
    estimates: {
      data: itemChartData?.estimates,
      label: labels.estimates,
    },
  };

  return (
    <IncidentQuarterlyActivityChart lineProps={lineProps} />
  );
};

export default Chart;
