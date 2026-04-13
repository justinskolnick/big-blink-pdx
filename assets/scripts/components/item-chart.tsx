import React, { useEffect, useState } from 'react';
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
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  type ChartType,
  type Color,
} from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';

import useSelector from '../hooks/use-app-selector';

import { getSourcesDataForChart } from '../selectors';

type BarType = 'bar';
type LineType = 'line';
type BarOrLine = BarType | LineType;

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

const itemColorStatic: Color = 'olivedrab';
const itemColorLink: Color = 'cornflowerblue';
const colorStatLabel: Color = 'darkolivegreen';

const options: ChartOptions<BarType> | ChartOptions<BarOrLine> = {
  animation: false,
  plugins: {
    legend: {
      align: 'center' as const,
      display: false,
      position: 'bottom' as const,
      labels: {
        borderRadius: 6,
        boxHeight: 12,
        boxWidth: 12,
        color: colorStatLabel,
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
      ticks: {
        align: 'start',
        color: colorStatLabel,
      },
    },
    y: {
      ticks: {
        color: colorStatLabel,
      },
    },
  },
};

export interface LineProps {
  data: (number | null)[];
  label?: string;
}

interface StackedProps {
  label?: string;
}

interface Props {
  handleClick: (value?: string) => void;
  lineProps: LineProps;
}

const barType: ChartType = 'bar';
const lineType: ChartType = 'line';

export const ItemChartStacked = ({ label }: StackedProps) => {
  const sources = useSelector(getSourcesDataForChart);
  const sourceData: ChartDataset<BarType> = {
    label: 'All incidents',
    data: sources.data,
    borderColor: 'rgba(222, 184, 135, 0.5)',
    backgroundColor: 'rgba(222, 184, 135, 0.5)',
    stack: 'combined',
    type: barType,
  };
  let itemData = undefined;

  if (label) {
    const labelIndex = sources.labels.indexOf(label);

    sourceData.data = sources.data.map((item, i) => i === labelIndex ? 0 : item);

    itemData = {
      label,
      data: sources.data.map((item, i) => i === labelIndex ? item : 0),
      borderColor: itemColorStatic,
      backgroundColor: itemColorStatic,
      borderWidth: 2,
      stack: 'combined',
      type: barType,
    } as ChartDataset<BarType>;
  }

  const data: ChartData<BarType> = {
    labels: sources.labels,
    datasets: itemData ? [itemData, sourceData] : [sourceData],
  };

  const hasDatasets = data.datasets.length > 1;

  const chartOptions: ChartOptions<BarType> = {
    ...options,
    plugins: {
      ...options.plugins,
      legend: {
        ...options.plugins?.legend,
        display: hasDatasets,
      },
    }
  };

  return (
    <Bar
      options={chartOptions}
      data={data}
    />
  );
};

const ItemChart = ({ handleClick, lineProps }: Props) => {
  const [hasLineLabel, setHasLineLabel] = useState<boolean>(false);

  const sources = useSelector(getSourcesDataForChart);
  const sourceData: ChartDataset<BarType> = {
    label: 'All incidents',
    data: sources.data,
    borderColor: 'rgba(222, 184, 135, 0.5)',
    backgroundColor: 'rgba(222, 184, 135, 0.5)',
    type: barType,
  };
  const itemData: ChartDataset<LineType> = {
    label: lineProps.label,
    data: lineProps.data,
    borderColor: itemColorLink,
    backgroundColor: itemColorLink,
    stack: 'combined',
    type: lineType,
  };
  const datasets: ChartDataset<BarOrLine>[] = [itemData, sourceData];

  const data: ChartData<BarOrLine> = {
    labels: sources.labels,
    datasets,
  };

  const hasDatasets = data.datasets.length > 1;

  const chartOptions: ChartOptions<BarOrLine> = {
    ...options,
    onClick: (event: ChartEvent, elements: [], chart: ChartJS) => {
      if (elements.length && chart?.tooltip?.title) {
        handleClick(chart.tooltip.title.at(0));
      }
    },
    plugins: {
      ...options.plugins,
      legend: {
        ...options.plugins?.legend,
        display: hasDatasets && hasLineLabel,
      },
    }
  };

  useEffect(() => {
    setHasLineLabel(Boolean(lineProps.label));
  }, [lineProps, setHasLineLabel]);

  return (
    <Chart
      datasetIdKey='id'
      options={chartOptions}
      data={data}
      type={barType}
    />
  );
};

export const Loading = () => (
  <div className='chart-loading'>
     <svg xmlns='http://www.w3.org/2000/svg'>
      <rect />
    </svg>
  </div>
);

export default ItemChart;
