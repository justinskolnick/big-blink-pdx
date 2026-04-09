import { ReactNode } from 'react';

import useFetchAndScrollOnRouteChange, { FetchWithCallback } from '../hooks/use-fetch-and-scroll-on-route-change';
import { type LazyTriggerFn } from '../services/api';
import type {
  Id,
  Ref,
} from '../types';

interface Props {
  children: ReactNode;
  id: Id;
  ref?: Ref;
  trigger?: LazyTriggerFn;
}

const IncidentsFetcher = ({ children, id, ref, trigger }: Props) => {
  const fetch: FetchWithCallback = async (callback) => {
    await trigger({ id, search: location.search });

    if (callback) {
      callback(ref);
    }
  };

  useFetchAndScrollOnRouteChange(fetch);

  return children;
};

export default IncidentsFetcher;
