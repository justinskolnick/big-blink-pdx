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
  const [lastId, setLastId] = useState(id);
  const [search, setSearch] = useState(location.search);

  useEffect(() => {
    const currentSearch = location.search;

    if (id !== lastId || search !== currentSearch) {
      setHasFetched(false);
      setLastId(id);
      setSearch(currentSearch);
    }

    if (!hasFetched) {
      setHasFetched(true);
      trigger({ id, search: currentSearch });
    }
  }, [
    hasFetched,
    id,
    lastId,
    location,
    search,
    setHasFetched,
    setLastId,
    setSearch,
    trigger,
  ]);

  return children;
};

export default IncidentsFetcher;
