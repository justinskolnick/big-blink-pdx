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

import type { Attendees as AttendeesType, Source } from '../../types';

interface Props {
  attendees: AttendeesType;
  source: Source;
}

const Attendees = ({
  attendees,
  source,
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
    <IncidentActivityGroups title='Associated Names'>
      {attendees ? (
        <IncidentActivityGroup title={
          <ItemTextWithIcon icon='database'>
            These people appear in {source.title}
          </ItemTextWithIcon>
        }>
          <StatBox title='City Officials:'>
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

          <StatBox title='Lobbyists:'>
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
