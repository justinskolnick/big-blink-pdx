import React, { ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import useLimitedQuery, { FnSetLimit, FnSetPaused } from '../hooks/use-limited-query';
import type { ApiQueryType } from '../hooks/use-limited-query';

import api from '../services/api';

import ActivityHeader from './detail-activity-header';
import ActivitySubhead from './detail-activity-subhead';
import AffiliatedEntitiesTable from './affiliated-entities-table';
import AffiliatedPeopleTable from './affiliated-people-table';
import { getRoleIconName } from './people/icon';
import IncidentActivityGroups from './incident-activity-groups';
import IncidentActivityGroup from './incident-activity-group';
import ItemSubsection from './item-subsection';

import type {
  AssociatedEntitiesValue,
  AssociatedPersonsValue,
  Entity,
  Person,
} from '../types';
import { Role } from '../types';

interface FnUseGetItemRolesById {
  (
    item: Entity | Person,
    options: Record<string, string>,
    isPaused: boolean,
  ): {
    initialLimit: number;
    setPaused: FnSetPaused;
    setRecordLimit: FnSetLimit;
  }
}

interface GroupProps {
  children: ReactNode;
  icon?: IconName;
  ref: RefObject<HTMLElement>;
  title: string;
}

interface AssociationGroupProps {
  children: (initialLimit: number, setLimit: FnSetLimit) => ReactNode;
  item: Entity | Person;
  role: Role;
  value?: AssociatedEntitiesValue | AssociatedPersonsValue;
}

interface NamedRoleProps {
  item?: Entity | Person;
  role: Role;
}

interface Props {
  item: Entity | Person;
}

const roleQuery = {
  entity: api.useLazyGetEntityRolesByIdQuery,
  group: api.useLazyGetPersonRolesByIdQuery,
  person: api.useLazyGetPersonRolesByIdQuery,
} as Record<string, ApiQueryType>;

const useGetItemRolesById: FnUseGetItemRolesById = (item, options, isPaused) => {
  const searchParams = new URLSearchParams(options);
  const query = roleQuery[item.type];

  return useLimitedQuery(query, {
    id: item.id,
    limit: 5,
    pause: isPaused,
    search: searchParams,
  });
};

const Group = ({ children, icon, ref, title }: GroupProps) => (
  <IncidentActivityGroups
    title={title}
    icon={icon}
    ref={ref}
  >
    <IncidentActivityGroup>
      <ItemSubsection>
        {children}
      </ItemSubsection>
    </IncidentActivityGroup>
  </IncidentActivityGroups>
);

const AssociationGroup = ({
  children,
  item,
  role,
  value
}: AssociationGroupProps) => {
  const options = {
    role,
    association: value?.association,
  };
  const {
    initialLimit,
    setPaused,
    setRecordLimit,
  } = useGetItemRolesById(item, options, true);

  const setLimit = () => {
    setPaused(false);
    setRecordLimit(value.total);
  };

  if (!value) return null;

  return children(initialLimit, setLimit);
};

const Attendees = ({ item, role }: NamedRoleProps) => {
  const ref = useRef<HTMLElement>(null);

  const namedRole = item?.roles.named?.[role];
  const attendees = namedRole?.attendees;

  const hasAttendees = attendees?.values.length > 0;

  if (!hasAttendees) return null;

  return (
    <Group
      title={attendees.label}
      icon='user-group'
      ref={ref}
    >
      {attendees.values.map((value, i: number) => (
        <AssociationGroup
          item={item}
          role={role}
          value={value}
          key={i}
        >
          {(initialLimit, setLimit) => (
            <AffiliatedPeopleTable
              attendees={value}
              initialCount={initialLimit}
              model={attendees.model}
              ref={ref}
              role={role}
              setLimit={setLimit}
            />
          )}
        </AssociationGroup>
      ))}
    </Group>
  );
};

const Entities = ({ item, role }: NamedRoleProps) => {
  const ref = useRef<HTMLElement>(null);

  const namedRole = item?.roles.named?.[role];
  const entities = namedRole?.entities;

  const hasEntities = entities?.values.length > 0;

  if (!hasEntities) return null;

  return (
    <Group
      title={entities.label}
      icon='building'
      ref={ref}
    >
      {entities.values.map((value, i: number) => (
        <AssociationGroup
          item={item}
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
              ref={ref}
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

const NamedRole = ({ item, role }: NamedRoleProps) => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const options = { role };
  const namedRole = item?.roles.named?.[role];

  useGetItemRolesById(item, options, hasRun);

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

      <Entities item={item} role={role} />
      <Attendees item={item} role={role} />
    </section>
  );
};

const Associations = ({ item }: Props) => {
  const options = item.roles.options;

  const roles = useMemo(() =>
    Object.entries(options).reduce((all, [key, value]) => {
      if (value) {
        all.push(key);
      }

      return all;
    }, []), [options]);

  return (
    <section className='activity-details'>
      <ActivityHeader title={item.roles.label} />

      {roles.map((role, i) => (
        <NamedRole key={i} item={item} role={role} />
      ))}
    </section>
  );
};

export default Associations;
