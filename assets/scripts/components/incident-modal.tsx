import React, { useEffect } from 'react';

import { useGetIncidentById } from '../reducers/incidents';

import api from '../services/api';

import { iconName } from './incidents/icon';
import { LinkIcon } from './icon';
import IncidentNotesBox from './incident-notes-box';
import IncidentTable from './incident-table';
import ItemSubhead from './item-subhead';
import MetaSection from './meta-section';
import Modal from './modal';

import type { Id } from '../types';

interface Props {
  deactivate: () => void;
  id: Id;
  isActive: boolean;
}

const IncidentModal = ({ deactivate, id, isActive }: Props) => {
  const [trigger] = api.useLazyGetIncidentByIdQuery();

  const incident = useGetIncidentById(id);

  const hasIncident = Boolean(incident);
  const hasAttendees = Boolean(incident && 'attendees' in incident);
  const hasNotes = Boolean(incident?.notes);

  useEffect(() => {
    if (hasAttendees) return;

    trigger({ id });
  }, [hasAttendees, id, trigger]);

  if (!hasIncident) return null;

  return (
    <Modal className='incident-modal' deactivate={deactivate} isActive={isActive}>
      <section className='modal-incident'>
        <header className='incident-header'>
          <ItemSubhead
            title={(
              <>
                <LinkIcon
                  name={iconName}
                  to={incident.links.self}
                />
                <span className='item-text'>
                  Lobbying Incident
                </span>
              </>
            )}
          >
            <LinkIcon
              name='link'
              title='View the full record'
              to={incident.links.self}
            />
          </ItemSubhead>
        </header>

        <main className='incident-main'>
          <IncidentTable incident={incident} />

          {hasNotes && (
            <MetaSection>
              <IncidentNotesBox
                title='Notes about this incident'
                incident={incident}
              />
            </MetaSection>
          )}
        </main>
      </section>
    </Modal>
  );
};

export default IncidentModal;
