import { unique } from '../../lib/array';

import type {
  Attendee,
  Attendees,
  Incident,
  Incidented,
  ItemRoles,
  NamedRoles,
  RoleOptions,
} from '../../types';

type RoleOptionsTuple = [
  key: keyof RoleOptions,
  value: boolean,
];

export const adaptAttendeeRecords = (records: Attendee[]) =>
  records.map(record => ({
    ...record,
    person: {
      id: record.person.id,
    },
  }));

export const adaptAttendees = (attendees: Attendees) => ({
  ...attendees,
  values: attendees.values.map(value => ({
    ...value,
    records: adaptAttendeeRecords(value.records),
  })),
} as Attendees);

export const adaptIncidents = (incidents: Incidented) => {
  const {
    filters,
    pagination,
    records,
    stats,
  } = incidents;
  const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

  return {
    filters,
    pagination,
    stats,
    ...ids,
  };
};

export const adaptRoles = (
  entryRoles: ItemRoles,
  savedEntryRoles?: ItemRoles
) => {
  const roles = {
    ...savedEntryRoles,
  };

  if ('label' in entryRoles) {
    roles.label = entryRoles.label;
  }

  if ('list' in entryRoles) {
    roles.list = unique([].concat(
      ...savedEntryRoles?.list ?? [],
      ...entryRoles.list,
    ));
  }

  if ('options' in entryRoles) {
    roles.options = Object.entries(entryRoles.options)
      .reduce((all, [key, value]: RoleOptionsTuple) => {
        const isFresh = !(key in all);
        const valueHasBecomeTrue = !isFresh && value === true && !all[key] === false;

        if (isFresh || valueHasBecomeTrue) {
          return {
            ...all,
            [key]: value,
          };
        }

        return all;
      }, savedEntryRoles?.options ?? {} as RoleOptions);

    if ('named' in entryRoles) {
      roles.named = {
        ...savedEntryRoles?.named,
        ...Object.entries(entryRoles.named).reduce((all, [key, values]) => {

          const roleKey = key as keyof NamedRoles;
          const savedRole = savedEntryRoles?.named?.[roleKey];

          if (values) {
            const { attendees, entities, ...rest } = values;

            all[roleKey] = {
              ...savedEntryRoles?.named?.[roleKey],
              ...rest,
            };

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
              };
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
              };
            }
          } else {
            all[roleKey] = savedEntryRoles?.named?.[roleKey];
          }

          return all;
        }, {} as NamedRoles),
      };
    }
  }

  return roles;
};
