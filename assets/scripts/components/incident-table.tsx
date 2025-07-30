import React from 'react';

import Attendees from './incident-attendees';
import Entity from './incident-entity';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
}

const IncidentTable = ({ incident }: Props) => {
  const hasDateRange = Boolean(incident.contactDateRange);
  const hasMultipleTypes = incident.contactTypes.length > 1;

  return (
    <table className='incident-table' cellPadding='0' cellSpacing='0'>
      <tbody>
        <tr>
          <th>Entity</th>
          <td>
            <Entity incident={incident} />
          </td>
        </tr>
        {hasDateRange ? (
          <tr>
            <th>Dates</th>
            <td>{incident.contactDateRange}</td>
          </tr>
        ) : (
          <tr>
            <th>Date</th>
            <td>{incident.contactDate}</td>
          </tr>
        )}
        <tr>
          {hasMultipleTypes ? (
            <>
              <th>Types</th>
              <td>
                <ul className='incident-types'>
                  {incident.contactTypes.map(type => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </td>
            </>
          ) : (
            <>
              <th>Type</th>
              <td>{incident.contactTypes.join()}</td>
            </>
          )}
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
};

export default IncidentTable;
