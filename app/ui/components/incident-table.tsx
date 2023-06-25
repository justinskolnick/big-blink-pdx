import React from 'react';
import { cx, css } from '@emotion/css';

import Attendees from './incident-attendees';
import { LinkToEntity } from './links';

import type { Incident } from '../types';

const styles = css`
  --color-divider: var(--color-light-gray);

  width: 100%;

  th, td {
    padding-top: 3px;
    padding-bottom: 3px;
    line-height: 18px;
    text-align: left;
  }

  tr {
    &:nth-of-type(n + 2) {
      th, td {
        border-top: 1px solid var(--color-divider);
      }
    }
  }

  th {
    color: var(--color-table-accent);

    &::after {
      content: ':';
    }
  }

  td {
    padding-left: var(--gap);
    font-size: 14px;

    a {
      font-weight: 600;
    }
  }
`;

interface Props {
  incident: Incident;
}

const IncidentTable = ({ incident }: Props) => (
  <table className={cx('incident-table', styles)} cellPadding='0' cellSpacing='0'>
    <tbody>
      <tr>
        <th>Entity</th>
        <td>
          <LinkToEntity id={incident.entityId}>{incident.entity}</LinkToEntity>
        </td>
      </tr>
      <tr>
        <th>Date</th>
        <td>{incident.contactDate}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{incident.contactType}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>{incident.category}</td>
      </tr>
      <tr>
        <th>Topic</th>
        <td>{incident.topic}</td>
      </tr>
      <tr>
        <th>Officials</th>
        <td>
          <Attendees attendees={incident.attendees?.officials} />
        </td>
      </tr>
      <tr>
        <th>Lobbyists</th>
        <td>
          <Attendees attendees={incident.attendees?.lobbyists} />
        </td>
      </tr>
    </tbody>
  </table>
);

export default IncidentTable;
