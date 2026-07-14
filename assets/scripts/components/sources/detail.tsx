import React from 'react';
import { useParams } from 'react-router';

import Chart from './chart';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

import { useGetSourceById } from '../../reducers/sources';

const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const item = useGetSourceById(numericId);

  return (
    <ItemDetail
      Chart={Chart}
      IncidentsTrigger={IncidentsTrigger}
      item={item}
    />
  );
};

export default Detail;
