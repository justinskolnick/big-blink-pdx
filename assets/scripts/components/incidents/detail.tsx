import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/incidents';

import IncidentNotesBox from '../incident-notes-box';
import IncidentSourceBox from '../incident-source-box';
import MetaSection from '../meta-section';
import IncidentTable from '../incident-table';
import ItemDetail from '../item-detail';
import ItemSubhead from '../item-subhead';


const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const incident = useSelector((state: RootState) => selectors.selectById(state, numericId));

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
        <MetaSection>
          <IncidentNotesBox
            title='Notes about this incident'
            incident={incident}
          />

          <IncidentSourceBox
            title='Data source'
            incident={incident}
          />
        </MetaSection>
      </div>
    </ItemDetail>
  );
};

export default Detail;
