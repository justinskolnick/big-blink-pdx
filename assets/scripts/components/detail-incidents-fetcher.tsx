import { ReactNode, RefObject } from 'react';

import useFetchAndScrollOnRouteChange, { FetchWithCallback } from '../hooks/use-fetch-and-scroll-on-route-change';
import type { TriggerFn } from '../services/api';
import type { Id } from '../types';

interface Props {
  children: ReactNode;
  id: Id;
  ref: RefObject<HTMLElement>;
  trigger?: TriggerFn;
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
