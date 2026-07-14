import React from 'react';
import { useParams } from 'react-router';

import Chart from './chart';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

import { useGetPersonById } from '../../reducers/people';

const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const item = useGetPersonById(numericId);

  return (
    <ItemDetail
      Chart={Chart}
      IncidentsTrigger={IncidentsTrigger}
      item={item}
      roleIsPrimary
    />
  );
};

export default Detail;
