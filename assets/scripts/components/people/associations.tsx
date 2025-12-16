import React, { ReactNode, useEffect, useState } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

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
  AssociatedEntitiesValue,
  AssociatedPersonsValue,
  Person
} from '../../types';
import { Role } from '../../types';

interface GroupProps {
  children: ReactNode;
  icon?: IconName;
  title: string;
}

interface FnSetLimit {
  (): void;
}

interface AssociationGroupProps {
  children: (initialLimit: number, setLimit: FnSetLimit) => ReactNode;
  id: Person['id'];
  role: Role;
  value: AssociatedEntitiesValue | AssociatedPersonsValue;
}

interface NamedRoleProps {
  person?: Person;
  role: Role;
}

interface Props {
  person: Person;
}

const Group = ({ children, icon, title }: GroupProps) => (
  <IncidentActivityGroups title={title} icon={icon}>
    <IncidentActivityGroup>
      <ItemSubsection>
        {children}
      </ItemSubsection>
    </IncidentActivityGroup>
  </IncidentActivityGroups>
);

const AssociationGroup = ({ children, id, role, value }: AssociationGroupProps) => {
  const searchParams = new URLSearchParams({
    role,
    association: value.association,
  });
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

  return children(initialLimit, setLimit);
};

const Attendees = ({ person, role }: NamedRoleProps) => {
  const namedRole = person?.roles.named?.[role];
  const attendees = namedRole?.attendees;

  return (
    <Group title={attendees.label} icon='user-group'>
      {attendees.values.map((value, i: number) => (
        <AssociationGroup
          id={person.id}
          role={role}
          value={value}
          key={i}
        >
          {(initialLimit, setLimit) => (
            <AffiliatedPeopleTable
              attendees={value}
              initialCount={initialLimit}
              model={attendees.model}
              setLimit={setLimit}
            />
          )}
        </AssociationGroup>
      ))}
    </Group>
  );
};

const Entities = ({ person, role }: NamedRoleProps) => {
  const namedRole = person?.roles.named?.[role];
  const entities = namedRole?.entities;

  return (
    <Group title={entities.label} icon='building'>
      {entities.values.map((value, i: number) => (
        <AssociationGroup
          id={person.id}
          role={role}
          value={value}
          key={i}
        >
          {(initialLimit, setLimit) => (
            <AffiliatedEntitiesTable
              entities={value}
              hasAuxiliaryType={value.role === Role.Lobbyist}
              hasLobbyist={value.role === Role.Lobbyist}
              initialCount={initialLimit}
              model={entities.model}
              role={value.role}
              setLimit={setLimit}
              title={value.label}
            />
          )}
        </AssociationGroup>
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

      <Entities person={person} role={role} />
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
