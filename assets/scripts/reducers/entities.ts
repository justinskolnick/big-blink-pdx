import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import camelcaseKeys from 'camelcase-keys';

import { unique } from '../lib/array';

import { adaptIncidents } from './shared/adapters';
import { getEntities } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  Entities,
  Entity,
  EntityWithIncidentRecords,
  Id,
  Ids,
  Incidents,
  Pagination,
  PersonNamedRoles,
  RoleOptions,
} from '../types';

type InitialState = {
  pageIds: Ids;
  pagination?: Pagination;
};

type RoleOptionsTuple = [
  key: keyof RoleOptions,
  value: boolean,
];

const adapter = createEntityAdapter<Entity>();

const selectors = adapter.getSelectors(getEntities);
export const useGetEntityById = (id: Id): Entity => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

export const adapters = {
  adaptOne: (state: RootState, entry: Entity | EntityWithIncidentRecords): Entity => {
    const savedEntry = selectors.selectById(state, entry.id);
    const adapted = { ...entry };

    if ('incidents' in adapted) {
      adapted.incidents = adaptIncidents(adapted.incidents);
    }

    if (savedEntry && 'overview' in savedEntry) {
      adapted.overview = {
        ...savedEntry.overview,
        ...adapted.overview,
      };
    }

    if ('roles' in entry) {
      adapted.roles = {
        ...savedEntry?.roles,
      };

      if ('label' in entry.roles) {
        adapted.roles.label = entry.roles.label;
      }

      if ('list' in entry.roles) {
        adapted.roles.list = unique([].concat(
          ...savedEntry?.roles.list ?? [],
          ...entry.roles.list,
        ));
      }

      if ('options' in entry.roles) {
        adapted.roles.options = Object.entries(entry.roles.options)
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
          }, savedEntry?.roles.options ?? {} as RoleOptions);

        if ('named' in entry.roles) {
          adapted.roles.named = {
            ...savedEntry?.roles.named,
            ...Object.entries(entry.roles.named).reduce((all, [key, values]) => {

              const roleKey = key as keyof PersonNamedRoles;
              const savedRole = savedEntry?.roles.named?.[roleKey];

              if (values) {
                const { attendees, entities, ...rest } = values;

                all[roleKey] = {
                  ...savedEntry?.roles.named?.[roleKey],
                  ...rest,
                };

                if (attendees) {
                  all[roleKey].attendees = {
                    ...savedRole?.attendees,
                    ...attendees,
                    values: Object.keys(adapted.roles.options).map(role => {
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
                all[roleKey] = savedEntry?.roles.named?.[roleKey];
              }

              return all;
            }, {} as PersonNamedRoles),
          };
        }
      }
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (entities: Entities): Ids =>
    entities.map((entity: Entity) => entity.id),
  getIncidents: (entity: EntityWithIncidentRecords): Incidents =>
    entity.incidents?.records ?? [],
};

const initialState = {
  pageIds: [],
  pagination: null,
} as InitialState;

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<Entity>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<Entities>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
  },
});

export const {
  set,
  setAll,
  setPageIds,
  setPagination,
} = entitiesSlice.actions;

export default entitiesSlice.reducer;
