import React, { ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import useLimitedQuery, { FnSetLimit, FnSetPaused } from '../hooks/use-limited-query';
import type { ApiQueryType } from '../hooks/use-limited-query';

import api from '../services/api';

import { ActivityDetailsSection } from './detail-activity-details';
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

export interface FnGetQueryByType {
  (type: string): ApiQueryType
}

interface GroupProps {
  children: (ref: RefObject<HTMLElement>) => ReactNode;
  icon?: IconName;
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

const getRoleQuery: FnGetQueryByType = (type) => {
  if (['group', 'person', 'unknown'].includes(type)) {
    return api.useLazyGetPersonRolesByIdQuery;
  } else if (type === 'entity') {
    return api.useLazyGetEntityRolesByIdQuery;
  }

  return null;
};

const useGetItemRolesByItem: FnUseGetItemRolesById = (item, options, isPaused) => {
  const searchParams = new URLSearchParams(options);
  const query = getRoleQuery(item.type);

  return useLimitedQuery(query, {
    id: item.id,
    limit: 5,
    pause: isPaused,
    search: searchParams,
  });
};

export const Group = ({ children, icon, title }: GroupProps) => {
  const ref = useRef<HTMLElement>(null);

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
    role,
    association: value?.association,
  };
  const {
    initialLimit,
    setPaused,
    setRecordLimit,
  } = useGetItemRolesByItem(item, options, true);

  const setLimit = () => {
    setPaused(false);
    setRecordLimit(value.total);
  };

  if (!value) return null;

  return children(initialLimit, setLimit);
};

const Attendees = ({ item, role }: NamedRoleProps) => {
  const namedRole = item?.roles.named?.[role];
  const items = namedRole?.attendees;

  const hasItems = items?.values.length > 0;

  if (!hasItems) return null;

  return (
    <Group
      title={items.label}
      icon='user-group'
    >
      {(ref) => items.values.map((value, i: number) => (
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
              model={items.model}
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
  const namedRole = item?.roles.named?.[role];
  const items = namedRole?.entities;

  const hasItems = items?.values.length > 0;

  if (!hasItems) return null;

  return (
    <Group
      title={items.label}
      icon='building'
    >
      {(ref) => items.values.map((value, i: number) => (
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
              model={items.model}
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
        icon={getRoleIconName(namedRole.role)}
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
