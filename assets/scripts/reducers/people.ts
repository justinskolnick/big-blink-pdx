import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import camelcaseKeys from 'camelcase-keys';

import { unique } from '../lib/array';

import { adaptIncidents } from './shared/adapters';
import { getPeople } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  Incidents,
  Pagination,
  People,
  Person,
  PersonNamedRoles,
  RoleOptions,
  PersonWithIncidentRecords,
} from '../types';

type InitialState = {
  pageIds: Ids;
  pagination?: Pagination;
  positionLookup: {
    completed: Ids;
    queue: Ids;
  };
};

type RoleOptionsTuple = [
  key: keyof RoleOptions,
  value: boolean,
];

export const adapter = createEntityAdapter<Person>();

const selectors = adapter.getSelectors(getPeople);

export const useGetPersonById = (id: Id): Person => {
  const person = useSelector((state: RootState) => selectors.selectById(state, id));

  return person;
};

export const useGetPersonPosition = (id: Id, date: string) => {
  const person = useGetPersonById(id);
  let officialPosition = null;

  if (person.officialPositions?.length) {
    officialPosition = person.officialPositions.find(position => {
      const { start, end } = position.dates;

      return start <= date && (end >= date || end === null);
    });
  }

  return officialPosition;
};

export const adapters = {
  adaptOne: (state: RootState, entry: PersonWithIncidentRecords): Person => {
    const savedEntry = selectors.selectById(state, entry.id);
    const adapted = { ...entry };

    if ('incidents' in entry) {
      adapted.incidents = adaptIncidents(adapted.incidents);
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

    if (savedEntry && 'overview' in savedEntry) {
      adapted.overview = {
        ...savedEntry.overview,
        ...adapted.overview,
      };
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (people: People): number[] =>
    people.map((person: Person) => person.id),
  getIncidents: (person: PersonWithIncidentRecords): Incidents =>
    person.incidents?.records ?? [],
};

const initialState = {
  pageIds: [],
  pagination: null,
  positionLookup: {
    completed: [],
    queue: [],
  },
} as InitialState;

export const peopleSlice = createSlice({
  name: 'people',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<Person>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<People>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    addToLookupCompleted: (state, action: PayloadAction<Id>) => {
      state.positionLookup.queue = state.positionLookup.queue.filter(id => id !== action.payload);
      state.positionLookup.completed.push(action.payload);
    },
    addToLookupQueue: (state, action: PayloadAction<Ids>) => {
      state.positionLookup.queue = unique([].concat(state.positionLookup.queue, action.payload));
    },
  },
});

export const {
  addToLookupCompleted,
  addToLookupQueue,
  set,
  setAll,
  setPageIds,
  setPagination,
} = peopleSlice.actions;

export default peopleSlice.reducer;
