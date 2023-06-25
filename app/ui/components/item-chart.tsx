import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  ChartEvent,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { getSourcesDataForChart } from '../selectors';

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
);

const options = {
  animation: false,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  maintainAspectRatio: true,
  plugins: {
    legend: {
      align: 'center' as const,
      display: false,
      position: 'bottom' as const,
      labels: {
        borderRadius: 6,
        boxHeight: 12,
        boxWidth: 12,
        color: 'brown',
        useBorderRadius: true,
      },
    },
  },
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
      ticks: {
        align: 'start',
        color: 'brown',
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: 'brown',
      },
    },
  },
  type: 'bar',
};

interface LineProps {
  data: number[];
  label?: string;
}

interface Props {
  handleClick?: (value: string) => void;
  label?: string;
  lineProps?: LineProps;
}

const itemColorStatic = 'olivedrab' as const;
const itemColorLink = 'cornflowerblue' as const;

const ItemChart = ({ handleClick, label, lineProps }: Props) => {
  const [hasLineLabel, setHasLineLabel] = useState(false);

  const sources = useSelector(getSourcesDataForChart);
  const sourceData = {
    id: 'sources',
    label: 'All incidents',
    data: sources.data,
    borderColor: 'rgba(222, 184, 135, 0.5)',
    backgroundColor: 'rgba(222, 184, 135, 0.5)',
    type: 'bar',
  };
  const itemColor = handleClick ? itemColorLink : itemColorStatic;
  let itemData = null;

  if (lineProps) {
    itemData = {
      label: lineProps.label,
      data: lineProps.data,
      borderColor: itemColor,
      backgroundColor: itemColor,
      stack: 'combined',
      type: 'line',
    };
  }

  if (label) {
    const labelIndex = sources.labels.indexOf(label);

    sourceData.data = sources.data.map((item, i) => i === labelIndex ? 0 : item);

    itemData = {
      label,
      data: sources.data.map((item, i) => i === labelIndex ? item : 0),
      borderColor: itemColor,
      backgroundColor: itemColor,
      type: 'bar',
    };
    options.scales.y.stacked = false;
  }

  const data = {
    labels: sources.labels,
    datasets: itemData ? [itemData, sourceData] : [sourceData],
  };

  const hasDatasets = data.datasets.length > 1;

  if (handleClick) {
    options.onClick = (event: ChartEvent, elements: [], chart: ChartJS) => {
      if (elements.length && chart?.tooltip?.title) {
        handleClick(chart.tooltip.title.at(0));
      }
    };
  }

  options.plugins.legend.display = hasDatasets && hasLineLabel;

  useEffect(() => {
    setHasLineLabel(Boolean(lineProps?.label));
  }, [lineProps, setHasLineLabel]);

  return (
    <div className='item-overview-chart'>
      <Bar
        datasetIdKey='id'
        options={options}
        data={data}
      />
    </div>
  );
};

export default ItemChart;
