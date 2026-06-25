import React from 'react';
import { useParams } from 'react-router';

import { useGetEntityById } from '../../reducers/entities';

import Chart from './chart';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const item = useGetEntityById(numericId);

  return (
    <ItemDetail
      Chart={Chart}
      IncidentsTrigger={IncidentsTrigger}
      item={item}
    />
  );
};

export default Detail;
