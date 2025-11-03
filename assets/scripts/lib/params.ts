import {
  dateOnParam,
  dateRangeFromParam,
  dateRangeToParam,
  pageParam,
  peopleParam,
  quarterParam,
  sortByParam,
  sortParam,
  withEntityIdParam,
  withPersonIdParam,
  yearParam,
} from '../config/constants';
import {
  DETAIL_ROUTE_PATTERN,
} from '../config/patterns';

import type { LocationPathname } from '../types';

const PAGE_PARAMS = [
  pageParam,
];
const SORT_PARAMS = [
  sortByParam,
  sortParam,
];
const INCIDENT_FILTER_PARAMS = [
  dateOnParam,
  dateRangeFromParam,
  dateRangeToParam,
  peopleParam,
  quarterParam,
  withEntityIdParam,
  withPersonIdParam,
];
const LEADERBOARD_FILTER_PARAMS = [
  quarterParam,
  yearParam,
];

export const isDetailRoute = (pathname: LocationPathname) => DETAIL_ROUTE_PATTERN.test(pathname);
export const hasPageSearchParams = (searchParams: URLSearchParams) => PAGE_PARAMS.some(p => searchParams.has(p));
export const hasSortSearchParams = (searchParams: URLSearchParams) => SORT_PARAMS.some(p => searchParams.has(p));
export const hasIncidentFilterSearchParams = (searchParams: URLSearchParams) => INCIDENT_FILTER_PARAMS.some(p => searchParams.has(p));
export const hasLeaderboardFilterSearchParams = (searchParams: URLSearchParams) => LEADERBOARD_FILTER_PARAMS.some(p => searchParams.has(p));
