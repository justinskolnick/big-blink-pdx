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

const NamedRole = ({ person, role }) => {
  const searchParams = new URLSearchParams({ role });
  const namedRole = person?.roles.named?.[role];

  const query = api.useLazyGetPersonRolesByIdQuery;

  useLimitedQuery(query, {
    id: person.id,
    limit: 5,
    search: `?${searchParams.toString()}`,
  });

  const hasRole = Boolean(role);
  const hasNamedRole = Boolean(namedRole);

  if (!hasRole) return null;
  if (!hasNamedRole) return null;

  return (
    <section className='activity-details-section'>
      <ItemSubhead
        title={namedRole.label}
        icon={getRoleIconName(namedRole.role)}
      />

      <Entities entities={namedRole.entities} />
      <Attendees attendees={namedRole.attendees} />
    </section>
  );
};

const NamedRoles = ({ person }: Props) => (
  <section className='activity-details'>
    {person.roles.list.map((role, i) => (
      <NamedRole key={i} person={person} role={role} />
    ))}
  </section>
);

export default NamedRoles;
