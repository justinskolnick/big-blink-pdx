import React, { ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import useLimitedQuery, {
  type FnSetLimit,
  type LimitedQueryReturnType,
} from '../hooks/use-limited-query';
import type { ApiQueryType } from '../hooks/use-limited-query';

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
  AssociatedEntitiesObjectValue,
  AssociatedPersonsObjectValue,
  EntityObject,
  PersonObject,
  RefElement,
  SourceObject,
} from '../types';
import { GenericObject, Role } from '../types';

type Item = EntityObject | PersonObject | SourceObject;

interface FnUseGetItemRolesById {
  (
    item: Item,
    options: GenericObject,
    isPaused: boolean,
  ): LimitedQueryReturnType
}

interface FnGetQueryByType {
  (type: string): ApiQueryType
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
  item?: Item;
  role: Role;
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

  return null;
};

const useGetItemRolesByItem: FnUseGetItemRolesById = (item, options, isPaused) => {
  const query = getRoleQuery(item.type);

  return useLimitedQuery(query, {
    id: item.id,
    limit: 5,
    pause: isPaused,
    search: options,
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
  const options = {
    association: value?.association,
  } as GenericObject;

  if (role) {
    options.role = role;
  }

  const {
    currentLimit,
    initialLimit,
    setPaused,
    setRecordLimit,
  } = useGetItemRolesByItem(item, options, true);

  const setLimit: FnSetLimit = (limit) => {
    setPaused(false);
    setRecordLimit(limit);
  };

  if (!value) return null;

  return children(initialLimit, currentLimit, setLimit);
};

const Attendees = ({ item, role }: NamedRoleProps) => {
  const namedRole = item?.roles.named?.[role];
  const items = namedRole?.attendees;
  const filterByRole = namedRole?.filterRole;

  const hasItems = items?.values?.length > 0;

  if (!hasItems) return null;

  return (
    <Group
      title={items.label}
      icon='user-group'
    >
      {(ref) => items.values.map((value, i: number) => (
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

const Entities = ({ item, role }: NamedRoleProps) => {
  const namedRole = item?.roles.named?.[role];
  const items = namedRole?.entities;
  const filterByRole = namedRole?.filterRole;

  const hasItems = items?.values?.length > 0;

  if (!hasItems) return null;

  return (
    <Group
      title={items.label}
      icon='building'
    >
      {(ref) => items.values.map((value, i: number) => (
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
  const options = { role };
  const namedRole = item?.roles.named?.[role];

  useGetItemRolesByItem(item, options, hasRun);

  useEffect(() => {
    setHasRun(true);
  }, [setHasRun]);

  const hasNamedRole = Boolean(namedRole);

  if (!hasNamedRole) return null;

  return (
    <ActivityDetailsSection>
      <ActivitySubhead
        title={namedRole.label}
        icon={getIconName(namedRole.role)}
      />

      <Entities item={item} role={role} />
      <Attendees item={item} role={role} />
    </ActivityDetailsSection>
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
    <>
      <ActivityHeader title={item.roles.label} />

      {roles.map((role, i) => (
        <NamedRole key={i} item={item} role={role} />
      ))}
    </>
  );
};

export default Associations;
