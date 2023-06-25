import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedItemTable from '../affiliated-item-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemTextWithIcon from '../item-text-with-icon';
import {
  getWithPersonParams,
  FilterLink,
  LinkToPerson,
} from '../links';
import StatBox from '../stat-box';

import type { Attendees as AttendeesType, Entity } from '../../types';

interface Props {
  attendees: AttendeesType;
  entity: Entity;
}

const Attendees = ({
  attendees,
  entity,
}: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/attendees');
      fetched.current = true;
    }
  }, [fetched, location]);

  return (
    <IncidentActivityGroups
      title='Associated Names'
      description={`These people appear in lobbying reports related to ${entity.name}${entity.name.endsWith('.') ? '' : '.'}`}
    >
      {attendees ? (
        <IncidentActivityGroup title={
          <ItemTextWithIcon icon='building'>
            As an entity, {entity.name} ...
          </ItemTextWithIcon>
        }>
          <StatBox title='Lobbied these City officials:'>
            <AffiliatedItemTable
              affiliatedItems={attendees.officials}
              label='people'
              TitleCell={({ item }) => (
                <LinkToPerson id={item.person.id}>
                  {item.person.name}
                </LinkToPerson>
              )}
              TotalCell={({ item }) => (
                <FilterLink newParams={getWithPersonParams(item)} hasIcon>
                  {item.total}
                </FilterLink>
              )}
            />
          </StatBox>

          <StatBox title='Through these lobbyists:'>
            <AffiliatedItemTable
              affiliatedItems={attendees.lobbyists}
              label='people'
              TitleCell={({ item }) => (
                <LinkToPerson id={item.person.id}>
                  {item.person.name}
                </LinkToPerson>
              )}
              TotalCell={({ item }) => (
                <FilterLink newParams={getWithPersonParams(item)} hasIcon>
                  {item.total}
                </FilterLink>
              )}
            />
          </StatBox>
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
