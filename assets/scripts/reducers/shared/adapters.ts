import { unique } from '../../lib/array';

import type {
  IncidentObjectAttendee,
  IncidentPayload,
  IncidentsIdsObject,
  IncidentsPayloadsObject,
  ObjectNamedRoles,
  ObjectNamedRoleWithAttendees,
  ObjectNamedRoleWithEntities,
  PayloadNamedRoles,
  RoleOptions,
} from '../../types';

export const adaptAttendeeRecords = (records: IncidentObjectAttendee[]) =>
  records.map(record => ({
    ...record,
    person: {
      id: record.person.id,
    },
  }));

export const adaptIncidents = (incidents: IncidentsPayloadsObject): IncidentsIdsObject => {
  const {
    filters,
    pagination,
    records,
    stats,
  } = incidents;
  const ids = records ? { ids: records.map((record: IncidentPayload) => record.id) } : undefined;

  return {
    filters,
    pagination,
    stats,
    ...ids,
  };
};

export const adaptRoles = <
  ItemPayloadType extends object,
  ItemObjectType extends object
>(
  entryRoles: ItemPayloadType,
  savedEntryRoles?: ItemObjectType
) => {
  let roles = {} as ItemObjectType;

  if (savedEntryRoles) {
    roles = { ...savedEntryRoles };
  }

  if ('label' in entryRoles) {
    roles = {
      ...roles,
      label: entryRoles.label,
    };
  }

  if ('list' in entryRoles) {
    roles = {
      ...roles,
      list: unique([].concat(
        ...savedEntryRoles?.list ?? [],
        ...entryRoles.list,
      )),
    };
  }

  if ('options' in entryRoles) {
    roles = {
      ...roles,
      options: Object.entries(entryRoles.options)
        .reduce((all, [k, value]) => {
          const key = k as keyof RoleOptions;

          const isFresh = !(key in all);
          const valueHasBecomeTrue = !isFresh && value === true && !all[key] === false;

          if (isFresh || valueHasBecomeTrue) {
            return {
              ...all,
              [key]: value,
            };
          }

          return all;
        }, savedEntryRoles?.options ?? {} as RoleOptions),
    };

    if ('named' in entryRoles) {
      roles = {
        ...roles,
        named: {
          ...savedEntryRoles?.named,
          ...Object.entries(entryRoles.named).reduce((all, [key, values]) => {
            const roleKey = key as keyof PayloadNamedRoles;
            const savedRole = savedEntryRoles?.named?.[roleKey];

            if (values) {
              const { attendees, entities, ...rest } = values;

              all[roleKey] = {
                ...savedEntryRoles?.named?.[roleKey],
                ...rest,
              } as ObjectNamedRoles;

              if (attendees) {
                all[roleKey].attendees = {
                  ...savedRole?.attendees,
                  ...attendees,
                  values: attendees.options.map(role => {
                    const savedValue = savedRole?.attendees?.values?.find(value => value?.role === role);
                    const newValue = attendees.values.find(value => value?.role === role);

                    if (newValue) {
                      return {
                        ...newValue,
                        records: newValue.records.map(record => ({
                          ...record,
                          person: {
                            id: record.person.id,
                          },
                        }))
                      };
                    }

                    return savedValue;
                  })
                } as ObjectNamedRoleWithAttendees;
              }

              if (entities) {
                all[roleKey].entities = {
                  ...savedRole?.entities,
                  ...values.entities,
                  values: entities.values.map(value => ({
                    ...value,
                    records: value.records.map(record => ({
                      ...record,
                      entity: {
                        id: record.entity.id,
                      },
                    }))
                  })),
                } as ObjectNamedRoleWithEntities;
              }
            }

            return all;
          }, {} as ObjectNamedRoles),
        },
      };
    }
  }

  return roles;
};
