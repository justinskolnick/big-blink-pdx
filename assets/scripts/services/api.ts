import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { handleError, handleResult } from './fetch-from-path';
import type { Result } from './fetch-from-path';

import type { GenericObject, Id } from '../types';

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

const TRANSITIONAL_API_PATHNAMES = [
  '/entities',
  '/incidents',
  '/people',
  '/sources',
];

const getQueryPath = (location: LocationOptions) => {
  const newUrl = new URL(location.pathname, baseUrl);
  const currentUrl = new URL(window.location.toString());

  currentUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.append(key, value);
  });

  if (newUrl.pathname === '/') {
    newUrl.pathname = '/api/home';
  } else {
    TRANSITIONAL_API_PATHNAMES.forEach(pathname => {
      if (newUrl.pathname.startsWith(pathname)) {
        newUrl.pathname = '/api' + newUrl.pathname;
      }
    });
  }

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

const getPathnameWithLimit = (pathname: string, options?: QueryFnOptions) => {
  const newUrl = new URL(pathname, baseUrl);
  const { limit, search } = options;

  if (search) {
    const values = search.split('?').filter(Boolean).flatMap(p => p.split('&')).reduce((all, item) => {
      const [key, value] = item.split('=');

      all[key] = value;

      return all;
    }, {} as GenericObject);
    const searchParams = new URLSearchParams(values);

    searchParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });
  }

  if (limit) {
    newUrl.searchParams.append('limit', String(limit));
  }

  return `${newUrl.pathname}${newUrl.search}`;
};

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
      () => 'api/stats'
    )),
    getLeaderboard: builder.query(getAncillaryRoute(
      ({ limit, search }) => getPathnameWithLimit('api/leaderboard', { limit, search })
    )),
    getLeaderboardEntities: builder.query(getAncillaryRoute(
      ({ limit, search }) => getPathnameWithLimit('api/leaderboard/entities', { limit, search })
    )),
    getLeaderboardLobbyists: builder.query(getAncillaryRoute(
      ({ limit, search }) => getPathnameWithLimit('api/leaderboard/lobbyists', { limit, search })
    )),
    getLeaderboardOfficials: builder.query(getAncillaryRoute(
      ({ limit, search }) => getPathnameWithLimit('api/leaderboard/officials', { limit, search })
    )),
    getPrimary: builder.query(getPrimaryRoute()),

    getEntityById: builder.query(getAncillaryRoute(
      ({ id }) => `api/entities/${id}`
    )),
    getEntityIncidentsById: builder.query(getAncillaryRoute(
      ({ id, search }) => `api/entities/${id}/incidents${search}`
    )),
    getEntityRolesById: builder.query(getAncillaryRoute(
      ({ id, limit, search }) => getPathnameWithLimit(`api/entities/${id}/roles`, { limit, search })
    )),
    getEntityStatsById: builder.query(getAncillaryRoute(
      ({ id }) => `api/entities/${id}/stats`
    )),

    getIncidentById: builder.query(getAncillaryRoute(
      ({ id }) => `api/incidents/${id}`
    )),

    getPersonIncidentsById: builder.query(getAncillaryRoute(
      ({ id, search }) => `api/people/${id}/incidents${search}`
    )),
    getPersonOfficialPositionsById: builder.query(getAncillaryRoute(
      ({ id }) => `api/people/${id}/official-positions`
    )),
    getPersonRolesById: builder.query(getAncillaryRoute(
      ({ id, limit, search }) => getPathnameWithLimit(`api/people/${id}/roles`, { limit, search })
    )),
    getPersonStatsById: builder.query(getAncillaryRoute(
      ({ id }) => `api/people/${id}/stats`
    )),

    getSourceIncidentsById: builder.query(getAncillaryRoute(
      ({ id, search }) => `api/sources/${id}/incidents${search}`
    )),
    getSourceRolesById: builder.query(getAncillaryRoute(
      ({ id, limit, search }) => getPathnameWithLimit(`api/sources/${id}/roles`, { limit, search })
    )),
    getSourceById: builder.query(getAncillaryRoute(
      ({ id }) => `api/sources/${id}`
    )),
  }),
});

export default api;
