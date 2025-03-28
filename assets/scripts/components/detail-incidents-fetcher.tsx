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
  const route = location.pathname + location.search;
  const [lastRoute, setLastRoute] = useState(route);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const currentRoute = location.pathname + location.search;

    if (lastRoute !== currentRoute) {
      setHasFetched(false);
      setLastRoute(currentRoute);
    }

    if (!hasFetched) {
      setHasFetched(true);
      trigger({ id, search: location.search });
    }
  }, [
    hasFetched,
    id,
    lastRoute,
    location,
    setHasFetched,
    setLastRoute,
    trigger,
  ]);

  return children;
};

export default IncidentsFetcher;
