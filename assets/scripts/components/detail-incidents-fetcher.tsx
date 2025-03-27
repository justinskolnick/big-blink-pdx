import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router';

import type { TriggerFn } from '../services/api';
import type { Id } from '../types';

interface Props {
  children: ReactNode;
  id: Id;
  trigger?: TriggerFn;
}

const IncidentsFetcher = ({ children, id, trigger }: Props) => {
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);
  const [search, setSearch] = useState(location.search);

  useEffect(() => {
    const currentSearch = location.search;

    if (!hasFetched || search !== currentSearch) {
      setHasFetched(true);
      setSearch(currentSearch);
      trigger({ id, search: currentSearch });
    }
  }, [
    hasFetched,
    id,
    location,
    search,
    setHasFetched,
    setSearch,
    trigger,
  ]);

  return children;
};

export default IncidentsFetcher;
