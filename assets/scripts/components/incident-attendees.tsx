import React from 'react';

import ItemLink from './people/item-link';

import { useGetPersonById } from '../reducers/people';

import type {
  Attendee,
  AttendeeGroup,
} from '../types';

interface IncidentAttendeeProps {
  attendee: Attendee;
}

interface Props {
  attendees?: AttendeeGroup;
}

const IncidentAttendee = ({ attendee }: IncidentAttendeeProps) => {
  const person = useGetPersonById(attendee.person.id);

  if (!person) return null;

  return (
    <>
      <ItemLink item={person}>{person.name}</ItemLink>
      {attendee.as !== person.name && (
        <span>
          {attendee.as}
        </span>
      )}
    </>
  );
};

const IncidentAttendees = ({ attendees }: Props) => {
  const hasAttendees = attendees?.records?.length > 0;

  if (!hasAttendees) {
    return 'none';
  }

  return (
    <ul className='incident-attendees'>
      {attendees.records.map(attendee => (
        <li key={attendee.person.id} className='incident-attendee'>
          <IncidentAttendee attendee={attendee} />
        </li>
      ))}
    </ul>
  );
};

export default IncidentAttendees;
