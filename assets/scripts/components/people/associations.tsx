import React, { ReactNode, useEffect, useState } from 'react';

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
  AssociatedEntities,
  AssociatedPersonsValue,
  Person
} from '../../types';
import { Role, Sections } from '../../types';

interface GroupProps {
  children: ReactNode;
  title: string;
}

interface AttendeeGroupProps {
  id: Person['id'];
  model: Sections;
  role: Role;
  value: AssociatedPersonsValue;
}

interface AttendeesProps {
  person?: Person;
  role: Role;
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

const AttendeeGroup = ({ id, model, role, value }: AttendeeGroupProps) => {
  const searchParams = new URLSearchParams({ role, association: value.association });
  const query = api.useLazyGetPersonRolesByIdQuery;

  const {
    initialLimit,
    setPaused,
    setRecordLimit,
  } = useLimitedQuery(query, {
    id,
    limit: 5,
    pause: true,
    search: searchParams,
  });

  const setLimit = () => {
    setPaused(false);
    setRecordLimit(value.total);
  };

  if (!value) return null;

  return (
    <AffiliatedPeopleTable
      attendees={value}
      initialCount={initialLimit}
      model={model}
      setLimit={setLimit}
    />
  );
};

const Attendees = ({ person, role }: AttendeesProps) => {
  const namedRole = person?.roles.named?.[role];
  const attendees = namedRole?.attendees;

  return (
    <Group title={attendees.label}>
      {attendees.values.map((value, i: number) => (
        <AttendeeGroup
          id={person.id}
          model={attendees.model}
          role={role}
          value={value}
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
  const [hasRun, setHasRun] = useState<boolean>(false);
  const searchParams = new URLSearchParams({ role });
  const namedRole = person?.roles.named?.[role];

  const query = api.useLazyGetPersonRolesByIdQuery;

  useLimitedQuery(query, {
    id: person.id,
    limit: 5,
    pause: hasRun,
    search: searchParams,
  });

  useEffect(() => {
    setHasRun(true);
  }, [setHasRun]);

  const hasNamedRole = Boolean(namedRole);

  if (!hasNamedRole) return null;

  return (
    <section className='activity-details-section'>
      <ActivitySubhead
        title={namedRole.label}
        icon={getRoleIconName(namedRole.role)}
      />

      <Entities entities={namedRole.entities} />
      <Attendees person={person} role={role} />
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
