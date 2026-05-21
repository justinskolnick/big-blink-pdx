import React from 'react';

import useSelector from '../hooks/use-app-selector';

import Attendees from './incident-attendees';
import Entity from './incident-entity';

import { getLabels } from '../selectors';

import {
  Role,
  type IncidentObject,
} from '../types';

interface Props {
  incident: IncidentObject;
}

const IncidentTable = ({ incident }: Props) => {
  const labels = useSelector(getLabels);

  const hasDateRange = Boolean(incident.contactDateRange);
  const hasMultipleTypes = incident.contactTypes.length > 1;

  return (
    <table className='incident-table' cellPadding='0' cellSpacing='0'>
      <tbody>
        <tr>
          <th>{labels.incidentsItemEntity}</th>
          <td>
            <Entity incident={incident} />
          </td>
        </tr>
        {hasDateRange ? (
          <tr>
            <th>{labels.incidentsItemDates}</th>
            <td>{incident.contactDateRange}</td>
          </tr>
        ) : (
          <tr>
            <th>{labels.incidentsItemDate}</th>
            <td>{incident.contactDate}</td>
          </tr>
        )}
        <tr>
          {hasMultipleTypes ? (
            <>
              <th>{labels.incidentsItemTypes}</th>
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
              <th>{labels.incidentsItemType}</th>
              <td>{incident.contactTypes.join()}</td>
            </>
          )}
        </tr>
        <tr>
          <th>{labels.incidentsItemCategory}</th>
          <td>{incident.category}</td>
        </tr>
        <tr>
          <th>{labels.incidentsItemTopic}</th>
          <td>{incident.topic}</td>
        </tr>
        <tr>
          <th>{labels.incidentsItemOfficials}</th>
          <td><Attendees incident={incident} role={Role.Official} /></td>
        </tr>
        <tr>
          <th>{labels.incidentsItemLobbyists}</th>
          <td><Attendees incident={incident} role={Role.Lobbyist} /></td>
        </tr>
      </tbody>
    </table>
  );
};

export default IncidentTable;
