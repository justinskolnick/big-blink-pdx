import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router';

import api from '../../services/api';

import type { Entity } from '../../types';

interface Props {
  children: ReactNode;
  entity: Entity;
}

const Incidents = ({ children, entity }: Props) => {
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);
  const [search, setSearch] = useState(location.search);
  const [trigger] = api.useLazyGetEntityIncidentsByIdQuery();

  useEffect(() => {
    const currentSearch = location.search;

    if (!hasFetched || search !== currentSearch) {
      setHasFetched(true);
      setSearch(currentSearch);
      trigger(entity.id);
    }
  }, [entity, hasFetched, location, search, setHasFetched, setSearch, trigger]);

  return children;
};

export default Incidents;
