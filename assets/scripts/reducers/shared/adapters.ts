import { unique } from '../../lib/array';

import type {
  AffiliatedEntityPayloadRecord,
  AffiliatedPersonPayloadRecord,
  AssociatedEntitiesObject,
  AssociatedEntitiesPayloadValue,
  AssociatedPersonsObject,
  AssociatedPersonsObjectValue,
  AssociatedPersonsPayloadValue,
  EntityObjectRoles,
  EntityPayloadRoles,
  IncidentObjectAttendee,
  IncidentPayload,
  IncidentsIdsObject,
  IncidentsPayloadsObject,
  ObjectNamedRoles,
  PayloadNamedRoles,
  PersonObjectRoles,
  PersonPayloadRoles,
  Role,
  RoleOptions,
  SourceObjectRoles,
  SourcePayloadRoles,
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
  ItemObjectType extends object
>(
  entryRoles: SourcePayloadRoles | PersonPayloadRoles | EntityPayloadRoles,
  savedEntryRoles?: SourceObjectRoles | PersonObjectRoles | EntityObjectRoles
): ItemObjectType => {
  let lastList: Role[] = [];
  let lastOptions = {} as RoleOptions;
  let lastNamed = {} as ObjectNamedRoles;

  let nextLabel: string = '';
  let nextList: Role[] = [];
  let nextOptions = {} as RoleOptions;
  let nextNamed = {} as ObjectNamedRoles;

  if ('label' in entryRoles) {
    nextLabel = entryRoles.label;
  }

  if ('list' in entryRoles) {
    if (savedEntryRoles && 'list' in savedEntryRoles) {
      lastList = savedEntryRoles.list;
    }

    if (lastList.length) {
      const emptyRoleArray: Role[] = [];

      nextList = unique(emptyRoleArray.concat(
        ...lastList,
        ...entryRoles.list,
      ));
    } else {
      nextList = entryRoles.list;
    }
  }

  if ('options' in entryRoles) {
    if (savedEntryRoles && 'options' in savedEntryRoles) {
      lastOptions = savedEntryRoles.options;
    }

    nextOptions = Object.entries(entryRoles.options)
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
      }, lastOptions || {});

    if (savedEntryRoles && 'named' in savedEntryRoles) {
      lastNamed = savedEntryRoles.named;
    }

    nextNamed = lastNamed;

    if ('named' in entryRoles) {
      nextNamed = entryRoles.named;

      nextNamed = {
        ...lastNamed,
        ...Object.entries(nextNamed).reduce((all: ObjectNamedRoles, [key, values]) => {
          const roleKey = key as keyof PayloadNamedRoles;
          const savedRole: ObjectNamedRoles = lastNamed?.[roleKey] ?? {};
          const {
            attendees: lastAttendees = {} as AssociatedPersonsObject,
            entities: lastEntities = {} as AssociatedEntitiesObject,
          } = savedRole;
          let roleObj = {};

          if (values) {
            const { attendees, entities, ...rest } = values;

            let nextAttendees = { ...lastAttendees };
            let nextEntities = { ...lastEntities };

            if (attendees) {
              nextAttendees = {
                ...nextAttendees,
                ...attendees,
                values: attendees.options.map((role: Role) => {
                  const savedValue = lastAttendees?.values?.find((value: AssociatedPersonsObjectValue) => value?.role === role);
                  const newValue = attendees.values.find((value: AssociatedPersonsPayloadValue) => value?.role === role);

                  if (newValue) {
                    return {
                      ...newValue,
                      records: newValue.records.map((record: AffiliatedPersonPayloadRecord) => ({
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
              nextEntities = {
                ...nextEntities,
                ...entities,
                values: entities.values.map((value: AssociatedEntitiesPayloadValue) => ({
                  ...value,
                  records: value.records.map((record: AffiliatedEntityPayloadRecord) => ({
                    ...record,
                    entity: {
                      id: record.entity.id,
                    },
                  }))
                })),
              };
            }

            roleObj = {
              ...rest,
              attendees: nextAttendees,
              entities: nextEntities,
            };
          }

          return {
            ...all,
            [roleKey]: roleObj,
          };
        }, {} as ObjectNamedRoles),
      };
    }
  }

  return {
    label: nextLabel,
    list: nextList,
    options: nextOptions,
    named: nextNamed,
  } as ItemObjectType;
};
