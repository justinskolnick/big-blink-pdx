import React from 'react';
import { useParams } from 'react-router';

import IncidentNotesBox from '../incident-notes-box';
import IncidentSourceBox from '../incident-source-box';
import MetaSection from '../meta-section';
import IncidentTable from '../incident-table';
import ItemDetail from '../item-detail';
import ItemSubhead from '../item-subhead';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';

import { useGetIncidentById } from '../../reducers/incidents';

const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const incident = useGetIncidentById(numericId);

  const hasIncident = Boolean(incident);
  const hasNotes = hasIncident && Boolean(incident.notes);

  useFetchAndScrollOnRouteChange();

  if (!hasIncident) return null;

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
          {hasNotes && (
            <IncidentNotesBox
              title='Notes about this incident'
              incident={incident}
            />
          )}

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
