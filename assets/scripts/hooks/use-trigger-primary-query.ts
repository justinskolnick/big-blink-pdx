import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import api from '../services/api';

const useTriggerPrimaryQuery = () => {
  const [trigger] = api.useLazyGetPrimaryQuery();
  const location = useLocation();

  useEffect(() => {
    const { pathname, search } = location;

    trigger({ pathname, search });
  }, [location, trigger]);
};

export default useTriggerPrimaryQuery;
