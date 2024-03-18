import type { LocationState, NewParams } from '../types';

const isCurrent = (location: LocationState, newSearch: string) => {
  const { pathname, search } = location;

  const currentPath = [pathname, search].filter(Boolean).join('');
  const linkedPath = [pathname, newSearch].filter(Boolean).join('?');

  return currentPath === linkedPath;
};

export const getQueryParams = (
  location: LocationState,
  newParams: NewParams,
  replace = true
) => {
  const { pathname, search } = location;
  const options = replace ? undefined : search;
  const searchParams = new URLSearchParams(options);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    } else {
      searchParams.delete(key);
    }
  });

  const newSearch = searchParams.toString();

  return {
    link: {
      pathname,
      search: newSearch,
    },
    get: (key: string) => searchParams.get(key),
    has: (key: string) => searchParams.has(key),
    isCurrent: isCurrent(location, newSearch),
  };
};
