import { useLocation } from 'react-router';

import { getQueryParams } from '../lib/links';

import type { NewParams } from '../types';

const useQueryParams = (newParams: NewParams, replace = true) => {
  const location = useLocation();

  return getQueryParams(location, newParams, replace);
};

export default useQueryParams;
