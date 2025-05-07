import React from 'react';

import ItemLink from './people/item-link';

import type { AttendeeGroup } from '../types';

interface Props {
  attendees?: AttendeeGroup;
}

const IncidentAttendees = ({ attendees }: Props) => {
  const hasAttendees = attendees?.records?.length > 0;

  if (!hasAttendees) {
    return 'none';
  }

  return (
    <ul className='incident-attendees'>
      {attendees.records.map(attendee => (
        <li key={attendee.person.id} className='incident-attendee'>
          <ItemLink item={attendee.person}>{attendee.person.name}</ItemLink>
          {attendee.as !== attendee.person.name && (
            <span>
              {attendee.as}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default IncidentAttendees;
