import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { handleError, handleResult } from '../lib/fetch-from-path';
import type { Result } from '../lib/fetch-from-path';

import type { Id } from '../types';

type LocationType = {
  pathname: string;
  search: string;
};

type Query = (id?: Id) => string;

const url = new URL('/', window.location.toString());
const baseUrl = url.origin;

const getQueryPath = (location: LocationType) => {
  const url = new URL(location.pathname, baseUrl);

  return url.pathname + location.search;
};

const getPrimaryRoute = () => ({
  query: getQueryPath,
  transformResponse: (result: Result) => {
    handleResult(result, true);
  },
  transformErrorResponse: handleError,
});

const getAncillaryRoute = (query: Query) => ({
  query,
  transformResponse: (result: Result) => {
    handleResult(result);
  },
  transformErrorResponse: handleError,
});

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
    getPrimary: builder.query(getPrimaryRoute()),

    getEntityAttendeesById: builder.query(getAncillaryRoute(
      id => `entities/${id}/attendees`
    )),
    getEntityStatsById: builder.query(getAncillaryRoute(
      id => `entities/${id}/stats`
    )),

    getIncidentById: builder.query(getAncillaryRoute(
      id => `incidents/${id}`
    )),

    getPersonAttendeesById: builder.query(getAncillaryRoute(
      id => `people/${id}/attendees`
    )),
    getPersonEntitiesById: builder.query(getAncillaryRoute(
      id => `people/${id}/entities`
    )),
    getPersonStatsById: builder.query(getAncillaryRoute(
      id => `people/${id}/stats`
    )),

    getSourceAttendeesById: builder.query(getAncillaryRoute(
      id => `sources/${id}/attendees`
    )),
    getSourceEntitiesById: builder.query(getAncillaryRoute(
      id => `sources/${id}/entities`
    )),
    getSourceById: builder.query(getAncillaryRoute(
      id => `sources/${id}`
    )),
  }),
});

export default api;
