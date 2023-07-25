import { createSelector } from '@reduxjs/toolkit';

import { RootState } from './lib/store';
import type { Ids, Id, Source } from './types';

type Stat = {
  dataSourceId?: Id;
  id: Id;
  incidentId?: Id;
  label?: string;
  total: number;
};

export const getEntities = (state: RootState) => state.entities;
export const getIncidents = (state: RootState) => state.incidents;
export const getPeople = (state: RootState) => state.people;
export const getSources = (state: RootState) => state.sources;
export const getStats = (state: RootState) => state.stats;
export const getUI = (state: RootState) => state.ui;

export const getEntitiesLeaderboard = createSelector(getEntities, entities => entities.leaderboard);
export const getEntitiesPagination = createSelector(getEntities, entities => entities.pagination);
export const getEntitiesPageIds = createSelector(getEntities, entities => entities.pageIds);

export const getIncidentsPagination = createSelector(getIncidents, incidents => incidents.pagination);
export const getIncidentsPageIds = createSelector(getIncidents, incidents => incidents.pageIds);
export const getIncidentFirst = createSelector(getIncidents, incidents => incidents.first);
export const getIncidentLast = createSelector(getIncidents, incidents => incidents.last);
export const getIncidentTotal = createSelector(getIncidents, incidents => incidents.total);

export const getPeopleLeaderboard = createSelector(getPeople, people => people.leaderboard);
export const getPeoplePagination = createSelector(getPeople, people => people.pagination);
export const getPeoplePageIds = createSelector(getPeople, people => people.pageIds);

const getSourcesStats = createSelector(getStats, stats => stats.sources);
const getSourcesChartIds = createSelector(
  getSourcesStats,
  stats => stats.map(value => value.id)
);
const getSourcesChartLabels = createSelector(
  getSourcesStats,
  stats => stats.map(value => value.label)
);
const getSourcesChartData = createSelector(
  getSourcesStats,
  stats => stats.map(value => value.total)
);
export const getSourcesDataForChart = createSelector(
  [getSourcesChartLabels, getSourcesChartData],
  (labels, data) => ({ labels, data, })
);

type SourcesByYear = {
  year: number;
  items: Source[];
};

export const getSourcesByYear = createSelector(
  getSources, (sources) => {
    const sourcesByYear = Object.values(sources.entities)
      .reduce((byYear, item) => {
        if (!(item.year in byYear)) {
          byYear[item.year] = {
            year: item.year,
            items: [],
          };
        }

        byYear[item.year].items.push(item);

        return byYear;
      }, {} as { [year: number]: SourcesByYear; });

    return Object.values(sourcesByYear);
  }
);

type Value = {
  id: Id;
  stats: Stat[];
};

const getIndexedTotals = (sourceIds: Ids, values: Value[]) =>
  values.map(value => value.id).reduce((indexed, id) => {
    const match = values.find(value => value.id === id);

    indexed[id] = sourceIds.map(sourceId => {
      const data = match.stats.find((stat: Stat) => stat.dataSourceId === sourceId);

      return data ? data.total : null;
    });

    return indexed;
  }, {} as { [index: Id]: number[]; });

const getEntitiesStats = createSelector(getStats, stats => stats.entities);
export const getEntitiesChartData = createSelector(
  [getSourcesChartIds, getEntitiesStats],
  getIndexedTotals
);

const getPeopleStats = createSelector(getStats, stats => stats.people);
export const getPeopleChartData = createSelector(
  [getSourcesChartIds, getPeopleStats],
  getIndexedTotals
);

export const getDescription = createSelector(getUI, ui => ui.description);
export const getErrors = createSelector(getUI, ui => ui.errors);
export const getMessages = createSelector(getUI, ui => ui.messages);
export const getWarnings = createSelector(getUI, ui => ui.warnings);
