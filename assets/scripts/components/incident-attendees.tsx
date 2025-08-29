import React, { ReactNode } from 'react';

import ItemLink from './people/item-link';

import {
  useGetPersonById,
  useGetPersonPosition,
} from '../reducers/people';

import { Role } from '../types';
import type {
  Attendee,
  Incident,
} from '../types';

interface IncidentAttendeeProps {
  attendee: Attendee;
  children?: ReactNode;
}

interface IncidentRoleProps {
  attendee: Attendee;
  date: string;
}

interface Props {
  incident: Incident;
  role: Role;
}

const useGetAttendeesByRole = (incident: Incident, role: Role) => {
  if (role === Role.Lobbyist) {
    return incident.attendees.lobbyists;
  } else if (role === Role.Official) {
    return incident.attendees.officials;
  }

  return null;
};

const IncidentAttendee = ({ attendee, children }: IncidentAttendeeProps) => {
  const person = useGetPersonById(attendee.person.id);

  const hasPerson = Boolean(person);
  const hasReportedName = attendee.as !== person.name;

  if (!hasPerson) return null;

  return (
    <>
      <div className='attendee-name'>
        <ItemLink item={person}>{person.name}</ItemLink>
        {hasReportedName && (
          <span className='attendee-name-reported-as'>
            {attendee.as}
          </span>
        )}
      </div>
      {children}
    </>
  );
};

const IncidentRole = ({ attendee, date }: IncidentRoleProps) => {
  const position = useGetPersonPosition(attendee.person.id, date);

  const hasRole = Boolean(position?.role);

  if (!hasRole) return null;

  return (
    <div className='attendee-role'>
      {position.role}
    </div>
  );
};

const IncidentAttendees = ({ incident, role }: Props) => {
  const attendees = useGetAttendeesByRole(incident, role);
  const hasAttendees = attendees?.records?.length > 0;
  const date = incident.raw.dateStart;

  if (!hasAttendees) {
    return 'none';
  }

  return (
    <ul className='incident-attendees'>
      {attendees.records.map(attendee => (
        <li key={attendee.person.id} className='incident-attendee'>
          <IncidentAttendee attendee={attendee}>
            {role === Role.Official && (
              <IncidentRole attendee={attendee} date={date} />
            )}
          </IncidentAttendee>
        </li>
      ))}
    </ul>
  );
};

export default IncidentAttendees;
