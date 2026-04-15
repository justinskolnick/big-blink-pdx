import { ReactNode } from 'react';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../hooks/use-fetch-and-scroll-on-route-change';
import { type LazyTriggerFn } from '../services/api';
import type {
  Id,
  Ref,
} from '../types';

interface Props {
  children: ReactNode;
  id: Id;
  ref?: Ref;
  trigger: LazyTriggerFn;
}

const IncidentsFetcher = ({ children, id, ref, trigger }: Props) => {
  const fetch: FetchWithCallbackRef = async (callback) => {
    await trigger({ id, search: location.search });

    if (callback && ref) {
      callback(ref);
    }
  };

  useFetchAndScrollOnRouteChange(fetch);

  return children;
};

export default IncidentsFetcher;
