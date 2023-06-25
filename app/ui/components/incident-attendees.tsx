import React from 'react';
import { cx, css } from '@emotion/css';

import { LinkToPerson } from './links';

import { Attendee as AttendeeType } from '../types';

interface AttendeeProps {
  attendee: AttendeeType;
}

interface AttendeesProps {
  attendees?: AttendeeType[];
}

const styles = css`
  .incident-attendee {
    span {
      color: var(--color-dull);
      font-weight: 200;
      font-size: 12px;

      &::before {
        content: 'as “';
      }

      &::after {
        content: '”';
      }
    }

    a + span {
      margin-left: 0.5ch;
    }
  }

  .incident-attendee + .incident-attendee {
    margin-top: 3px;
  }
`;

const Attendee = ({ attendee }: AttendeeProps) => (
  <li key={attendee.person.id} className='incident-attendee'>
    <LinkToPerson id={attendee.person.id}>{attendee.person.name}</LinkToPerson>
    {attendee.as !== attendee.person.name && (
      <span>
        {attendee.as}
      </span>
    )}
  </li>
);

const Attendees = ({ attendees }: AttendeesProps) => {
  const hasAttendees = attendees?.length > 0;

  return (
    <ul className={cx('incident-attendees', styles)}>
      {hasAttendees ? attendees.map(attendee => (
        <Attendee key={attendee.person.id} attendee={attendee} />
      )) : 'none'}
    </ul>
  );
};

export default Attendees;
