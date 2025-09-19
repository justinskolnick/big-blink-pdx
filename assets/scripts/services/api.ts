import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { handleError, handleResult } from '../lib/fetch-from-path';
import type { Result } from '../lib/fetch-from-path';

import type { Id } from '../types';

interface LocationOptions {
  pathname: string;
  search: string;
}

interface QueryFnOptions {
  id?: Id;
  limit?: number;
  search?: string;
}

type QueryFn = (options?: QueryFnOptions) => string;

export type TriggerFn = (options?: QueryFnOptions) => void;

const getUrl = (url: string) => new URL(url, window.location.toString());

const baseUrl = getUrl('/').origin;

const getQueryPath = (location: LocationOptions) => {
  const newUrl = new URL(location.pathname, baseUrl);
  const currentUrl = new URL(window.location.toString());

  currentUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.append(key, value);
  });

  return newUrl.pathname.replace(/^\//, '') + newUrl.search;
};

const getPrimaryRoute = () => ({
  query: getQueryPath,
  transformResponse: (result: Result) => {
    handleResult(result, true);
  },
  transformErrorResponse: handleError,
});

const getAncillaryRoute = (query: QueryFn) => ({
  query,
  transformResponse: (result: Result) => {
    handleResult(result);
  },
  transformErrorResponse: handleError,
});

const getPathnameWithLimit = (pathname: string, limit?: number) =>
  limit ? `${pathname}?limit=${limit}` : pathname;

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'same-origin',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOverview: builder.query(getAncillaryRoute(
      () => 'overview'
    )),
    getLeaderboard: builder.query(getAncillaryRoute(
      ({ search }) => `leaderboard${search}`
    )),
    getPrimary: builder.query(getPrimaryRoute()),

    getEntityById: builder.query(getAncillaryRoute(
      ({ id }) => `entities/${id}`
    )),
    getEntityAttendeesById: builder.query(getAncillaryRoute(
      ({ id, limit }) => getPathnameWithLimit(`entities/${id}/attendees`, limit)
    )),
    getEntityIncidentsById: builder.query(getAncillaryRoute(
      ({ id, search }) => `entities/${id}/incidents${search}`
    )),
    getEntityStatsById: builder.query(getAncillaryRoute(
      ({ id }) => `entities/${id}/stats`
    )),

    getIncidentById: builder.query(getAncillaryRoute(
      ({ id }) => `incidents/${id}`
    )),

    getPersonAttendeesById: builder.query(getAncillaryRoute(
      ({ id, limit }) => getPathnameWithLimit(`people/${id}/attendees`, limit)
    )),
    getPersonEntitiesById: builder.query(getAncillaryRoute(
      ({ id }) => `people/${id}/entities`
    )),
    getPersonIncidentsById: builder.query(getAncillaryRoute(
      ({ id, search }) => `people/${id}/incidents${search}`
    )),
    getPersonOfficialPositionsById: builder.query(getAncillaryRoute(
      ({ id }) => `people/${id}/official-positions`
    )),
    getPersonStatsById: builder.query(getAncillaryRoute(
      ({ id }) => `people/${id}/stats`
    )),

    getSourceAttendeesById: builder.query(getAncillaryRoute(
      ({ id, limit }) => getPathnameWithLimit(`sources/${id}/attendees`, limit)
    )),
    getSourceEntitiesById: builder.query(getAncillaryRoute(
      ({ id }) => `sources/${id}/entities`
    )),
    getSourceIncidentsById: builder.query(getAncillaryRoute(
      ({ id, search }) => `sources/${id}/incidents${search}`
    )),
    getSourceById: builder.query(getAncillaryRoute(
      ({ id }) => `sources/${id}`
    )),
  }),
});

export default api;
