import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/incidents';

import IncidentSourceBox from '../incident-source-box';
import IncidentStatGroup from '../incident-stat-group';
import IncidentTable from '../incident-table';
import ItemDetail from '../item-detail';
import ItemSubhead from '../item-subhead';
import StatBox from '../stat-box';

const Detail = () => {
  const { id } = useParams();

  const incident = useSelector((state: RootState) => selectors.selectById(state, id));

  if (!incident) return null;

  return (
    <ItemDetail>
      <div className='item-content-section item-content-section-primary'>
        <ItemSubhead title='Details' />
        <div className='incident-details'>
          <IncidentTable incident={incident} />
        </div>
      </div>

      <div className='item-content-section item-content-section-secondary'>
        <IncidentStatGroup>
          <IncidentSourceBox
            incident={incident}
            title='Data source'
          />

          <StatBox className='activity-stat-details' title='Notes regarding this incident' icon='asterisk'>
            {incident.notes || 'None'}
          </StatBox>
        </IncidentStatGroup>
      </div>
    </ItemDetail>
  );
};

export default Detail;
