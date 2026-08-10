import React from 'react';
import { useParams } from 'react-router';

import IncidentsTrigger from './detail-incidents-trigger';
import { ItemChartStacked as ItemChart } from '../item-chart';
import ItemDetail from '../item-detail';

import { useGetSourceById } from '../../reducers/sources';

const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const item = useGetSourceById(numericId);

  return (
    <ItemDetail
      Chart={ItemChart}
      IncidentsTrigger={IncidentsTrigger}
      item={item}
    />
  );
};

export default Detail;
