import React, { ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import useLimitedQuery, {
  type FnSetLimit,
  type LimitedQueryReturnType,
} from '../hooks/use-limited-query';
import type { SearchValue } from '../hooks/use-limited-query';

import api from '../services/api';

import { ActivityDetailsSection } from './detail-activity-details';
import ActivityHeader from './detail-activity-header';
import ActivitySubhead from './detail-activity-subhead';
import AffiliatedEntitiesTable from './affiliated-entities-table';
import AffiliatedPeopleTable from './affiliated-people-table';
import { getIconName } from './role/icon';
import IncidentActivityGroups from './incident-activity-groups';
import IncidentActivityGroup from './incident-activity-group';
import ItemSubsection from './item-subsection';

import type {
  AssociatedPersonsObject,
  AssociatedEntitiesObject,
  AssociatedEntitiesObjectValue,
  AssociatedPersonsObjectValue,
  EntityObject,
  ObjectNamedRoles,
  ObjectNamedRoleWithAttendees,
  ObjectNamedRoleWithEntities,
  PersonObject,
  RefElement,
  RoleOptions,
  SourceObject,
} from '../types';
import { Role } from '../types';

type Item = EntityObject | PersonObject | SourceObject;
type ObjectNamedRole = ObjectNamedRoleWithAttendees & ObjectNamedRoleWithEntities;
type RoleKey = keyof RoleOptions;

interface FnUseGetItemRolesById {
  (
    item: Item,
    searchOptions: SearchValue,
    isPaused: boolean,
  ): LimitedQueryReturnType
}

type QueryType = typeof api.useLazyGetPersonRolesByIdQuery | typeof api.useLazyGetEntityRolesByIdQuery | typeof api.useLazyGetSourceRolesByIdQuery;

interface FnGetQueryByType {
  (type: string): QueryType
}

interface GroupProps {
  children: (ref: RefObject<RefElement>) => ReactNode;
  icon?: IconName;
  title: string;
}

interface AssociationGroupProps {
  children: (
    initialLimit: number,
    currentLimit: number,
    setLimit: FnSetLimit
  ) => ReactNode;
  item: Item;
  role?: Role;
  value?: AssociatedEntitiesObjectValue | AssociatedPersonsObjectValue;
}

interface NamedRoleProps {
  item: Item;
  role: keyof ObjectNamedRoles;
}

interface AttendeesProps {
  items?: AssociatedPersonsObject;
  filterByRole: boolean;
  item: Item;
  role: keyof ObjectNamedRoles;
}

interface EntitiesProps {
  items?: AssociatedEntitiesObject;
  filterByRole: boolean;
  item: Item;
  role: keyof ObjectNamedRoles;
}

interface Props {
  item: Item;
}

const getRoleQuery: FnGetQueryByType = (type) => {
  if (['group', 'person', 'unknown'].includes(type)) {
    return api.useLazyGetPersonRolesByIdQuery;
  } else if (type === 'entity') {
    return api.useLazyGetEntityRolesByIdQuery;
  } else if (type === 'activity') {
    return api.useLazyGetSourceRolesByIdQuery;
  }

  return api.useLazyGetPersonRolesByIdQuery;
  // return null;
};

const useGetItemRolesByItem: FnUseGetItemRolesById = (item, searchOptions, isPaused) => {
  const query = getRoleQuery(item.type);

  return useLimitedQuery(query, {
    id: item.id,
    limit: 5,
    pause: isPaused,
    search: searchOptions,
  });
};

export const Group = ({ children, icon, title }: GroupProps) => {
  const ref = useRef<RefElement>(null);

  return (
    <IncidentActivityGroups
      title={title}
      icon={icon}
      ref={ref}
    >
      <IncidentActivityGroup>
        <ItemSubsection>
          {children(ref)}
        </ItemSubsection>
      </IncidentActivityGroup>
    </IncidentActivityGroups>
  );
};

const AssociationGroup = ({
  children,
  item,
  role,
  value
}: AssociationGroupProps) => {
  const searchOptions: SearchValue = {};

  if (value) {
    searchOptions.association = value.association;
  }

  if (role) {
    searchOptions.role = role;
  }

  const {
    currentLimit,
    initialLimit,
    setPaused,
    setRecordLimit,
  } = useGetItemRolesByItem(item, searchOptions, true);

  const setLimit: FnSetLimit = (limit) => {
    setPaused(false);
    setRecordLimit(limit);
  };

  if (!value) return null;

  return children(initialLimit, currentLimit, setLimit);
};

const Attendees = ({
  filterByRole,
  item,
  items,
  role
}: AttendeesProps) => {
  const hasItems = items?.values?.length ?? 0 > 0;

  if (!hasItems) return null;

  return (
    <Group
      title={items?.label ?? ''}
      icon='user-group'
    >
      {(ref) => items?.values.map((value: AssociatedPersonsObjectValue, i: number) => (
        <AssociationGroup
          item={item}
          role={filterByRole ? role : undefined}
          value={value}
          key={i}
        >
          {(initialLimit, currentLimit, setLimit) => (
            <AffiliatedPeopleTable
              attendees={value}
              currentLimit={currentLimit}
              initialCount={initialLimit}
              links={value.links}
              ref={ref}
              role={filterByRole ? role : undefined}
              setLimit={setLimit}
            />
          )}
        </AssociationGroup>
      ))}
    </Group>
  );
};

const Entities = ({
  filterByRole,
  item,
  items,
  role
}: EntitiesProps) => {
  const hasItems = items?.values?.length ?? 0 > 0;

  if (!hasItems) return null;

  return (
    <Group
      title={items?.label ?? ''}
      icon='building'
    >
      {(ref) => items?.values.map((value: AssociatedEntitiesObjectValue, i: number) => (
        <AssociationGroup
          item={item}
          role={filterByRole ? role : undefined}
          value={value}
          key={i}
        >
          {(initialLimit, currentLimit, setLimit) => (
            <AffiliatedEntitiesTable
              currentLimit={currentLimit}
              entities={value}
              hasAuxiliaryType={value.role === Role.Lobbyist}
              hasLobbyist={value.role === Role.Lobbyist}
              initialCount={initialLimit}
              links={value.links}
              ref={ref}
              role={filterByRole ? value.role : undefined}
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
  const searchOptions = { role };
  const namedRole = item?.roles?.named?.[role] ?? {} as ObjectNamedRole;

  useGetItemRolesByItem(item, searchOptions, hasRun);

  useEffect(() => {
    setHasRun(true);
  }, [setHasRun]);

  const hasItem = item !== undefined;
  const hasNamedRole = namedRole !== undefined;

  if (!hasItem || !hasNamedRole) return null;

  return (
    <ActivityDetailsSection>
      <ActivitySubhead
        title={namedRole.label}
        icon={getIconName(namedRole.role)}
      />

      <Entities
        filterByRole={namedRole.filterRole}
        item={item}
        items={namedRole.entities}
        role={role}
      />
      <Attendees
        filterByRole={namedRole.filterRole}
        item={item}
        items={namedRole.attendees}
        role={role}
      />
    </ActivityDetailsSection>
  );
};

const Associations = ({ item }: Props) => {
  const options = item.roles?.options;

  const roles = useMemo(() => {
    const availableOptions: RoleKey[] = [];
    return Object.entries(options || {}).reduce((all, [key, value]) => {
      const k = key as RoleKey;

      if (value === true) {
        all.push(k);
      }

      return all;
    }, availableOptions);
  }, [options]);

  const hasItem = item !== undefined;
  const hasItemRoles = item?.roles !== undefined;

  if (!hasItem || !hasItemRoles) return null;

  return (
    <>
      <ActivityHeader title={item.roles?.label ?? ''} />

      {roles.map((role, i) => (
        <NamedRole key={i} item={item} role={role} />
      ))}
    </>
  );
};

export default Associations;
