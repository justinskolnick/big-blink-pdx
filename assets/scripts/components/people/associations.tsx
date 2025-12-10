import React, { ReactNode, useState } from 'react';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import ActivityHeader from '../detail-activity-header';
import ActivitySubhead from '../detail-activity-subhead';
import AffiliatedEntitiesTable from '../affiliated-entities-table';
import AffiliatedPeopleTable from '../affiliated-people-table';
import { getRoleIconName } from './icon';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
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

interface NamedRoleProps {
  person?: Person;
  role: Role;
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

const NamedRole = ({ person, role }: NamedRoleProps) => {
  const searchParams = new URLSearchParams({ role });
  const namedRole = person?.roles.named?.[role];

  const query = api.useLazyGetPersonRolesByIdQuery;

  useLimitedQuery(query, {
    id: person.id,
    limit: 5,
    search: `?${searchParams.toString()}`,
  });

  const hasNamedRole = Boolean(namedRole);

  if (!hasNamedRole) return null;

  return (
    <section className='activity-details-section'>
      <ActivitySubhead
        title={namedRole.label}
        icon={getRoleIconName(namedRole.role)}
      />

      <Entities entities={namedRole.entities} />
      <Attendees attendees={namedRole.attendees} />
    </section>
  );
};

const Associations = ({ person }: Props) => (
  <section className='activity-details'>
    <ActivityHeader title={person.roles.label} />

    {person.roles.list.map((role, i) => (
      <NamedRole key={i} person={person} role={role} />
    ))}
  </section>
);

export default Associations;
