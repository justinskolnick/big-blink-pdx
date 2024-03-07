import React from 'react';

import { LinkToPerson } from './links';

import type { AttendeeGroup } from '../types';

interface Props {
  attendees?: AttendeeGroup;
}

const Attendees = ({ attendees }: Props) => {
  const hasAttendees = attendees?.records.length > 0;

  return (
    <ul className='incident-attendees'>
      {hasAttendees ? attendees.records.map(attendee => (
        <li key={attendee.person.id} className='incident-attendee'>
          <LinkToPerson id={attendee.person.id}>{attendee.person.name}</LinkToPerson>
          {attendee.as !== attendee.person.name && (
            <span>
              {attendee.as}
            </span>
          )}
        </li>
      )) : 'none'}
    </ul>
  );
};

export default Attendees;
