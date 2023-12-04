import React from 'react';
import { cx, css } from '@emotion/css';

import { LinkToPerson } from './links';

import { AttendeeGroup } from '../types';

interface Props {
  attendees?: AttendeeGroup;
}

const styles = css`
  .incident-attendee {
    span {
      color: var(--color-text-lighter);
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

const Attendees = ({ attendees }: Props) => {
  const hasAttendees = attendees?.records.length > 0;

  return (
    <ul className={cx('incident-attendees', styles)}>
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
