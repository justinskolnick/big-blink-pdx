import React from 'react';
import { useParams } from 'react-router';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';
import useSelector from '../../hooks/use-app-selector';

import IncidentNotesBox from '../incident-notes-box';
import MetaSection from '../meta-section';
import IncidentTable from '../incident-table';
import { Container as ItemDetail } from '../item-detail';
import SourceItem from '../sources/item';
import ItemSubhead from '../item-subhead';

import { getLabels } from '../../selectors';

import { useGetIncidentById } from '../../reducers/incidents';

const Detail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const labels = useSelector(getLabels);

  const incident = useGetIncidentById(numericId);

  const hasIncident = Boolean(incident);
  const hasNotes = hasIncident && Boolean(incident.notes);

  useFetchAndScrollOnRouteChange();

  if (!hasIncident) return null;

  return (
    <ItemDetail>
      <div className='item-content-section item-content-section-primary'>
        <ItemSubhead title={labels.incidentsItemDetails} />
        <div className='incident-details'>
          <IncidentTable incident={incident} />
        </div>
      </div>

      {hasNotes && (
        <div className='item-content-section item-content-section-secondary'>
          <MetaSection>
            <IncidentNotesBox
              title={labels.incidentsItemNotesTitle}
              incident={incident}
            />
          </MetaSection>
        </div>
      )}

      <div className='item-content-section item-content-section-secondary'>
        <div className='incident-source'>
          <ItemSubhead title={labels.sourcesItemInformation} />
          <div className='incident-source-details'>
            <SourceItem id={incident?.sourceId} />
          </div>
        </div>
      </div>
    </ItemDetail>
  );
};

export default Detail;
