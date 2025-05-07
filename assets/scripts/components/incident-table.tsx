import React from 'react';

import Attendees from './incident-attendees';
import Entity from './incident-entity';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
}

const IncidentTable = ({ incident }: Props) => (
  <table className='incident-table' cellPadding='0' cellSpacing='0'>
    <tbody>
      <tr>
        <th>Entity</th>
        <td>
          <Entity incident={incident} />
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
        <td><Attendees attendees={incident.attendees?.officials} /></td>
      </tr>
      <tr>
        <th>Lobbyists</th>
        <td><Attendees attendees={incident.attendees?.lobbyists} /></td>
      </tr>
    </tbody>
  </table>
);

export default IncidentTable;
