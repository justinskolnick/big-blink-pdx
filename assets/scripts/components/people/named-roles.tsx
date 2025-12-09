import React, { ReactNode, useState } from 'react';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import AffiliatedPeopleTable from '../affiliated-people-table';
import { getRoleIconName } from './icon';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemSubhead from '../item-subhead';
import ItemSubsection from '../item-subsection';

import type {
  AssociatedPersons,
  AssociatedEntities,
  Person
} from '../../types';
import { Role } from '../../types';

interface GroupProps {
  children: ReactNode;
  title: string;
}

interface AttendeesProps {
  attendees: AssociatedPersons;
}

interface EntitiesProps {
  entities: AssociatedEntities;
}

interface Props {
  person: Person;
}

const Group = ({ children, title }: GroupProps) => (
  <IncidentActivityGroups title={title}>
    <IncidentActivityGroup>
      <ItemSubsection>
        {children}
      </ItemSubsection>
    </IncidentActivityGroup>
  </IncidentActivityGroups>
);

const Attendees = ({ attendees }: AttendeesProps) => {
  const initialLimit = 5;
  const [, setRecordLimit] = useState(initialLimit);

  return (
    <Group title={attendees.label}>
      {attendees.values.map((value, i: number) => (
        <AffiliatedPeopleTable
          attendees={value}
          initialCount={initialLimit}
          model={attendees.model}
          setLimit={setRecordLimit}
          key={i}
        />
      ))}
    </Group>
  );
};

const Entities = ({ entities }: EntitiesProps) => {
  const initialLimit = 5;
  const [, setRecordLimit] = useState(initialLimit);

  return (
    <Group title={entities.label}>
      {entities.values.map((value, i: number) => (
        <AffiliatedEntitiesTable
          entities={value}
          hasAuxiliaryType={value.role === Role.Lobbyist}
          hasLobbyist={value.role === Role.Lobbyist}
          initialCount={initialLimit}
          model={entities.model}
          role={value.role}
          setLimit={setRecordLimit}
          title={value.label}
          key={i}
        />
      ))}
    </Group>
  );
};

const NamedRoles = ({ person }: Props) => {
  const query = api.useLazyGetPersonRolesByIdQuery;

  useLimitedQuery(query, {
    id: person.id,
    limit: 5,
  });

  const hasPerson = Boolean(person);
  const hasRoles = hasPerson && 'named' in person.roles;

  if (!hasRoles) return null;

  return (
    <section className='activity-details'>
      {Object.values(person.roles.named).map((role, i) => (
        <section key={i} className='activity-details-section'>
          <ItemSubhead
            title={role.label}
            icon={getRoleIconName(role.role)}
          />

          <Entities entities={role.entities} />
          <Attendees attendees={role.attendees} />
        </section>
      ))}
    </section>
  );
};

export default NamedRoles;
