import { useEffect, useState } from 'react';

import type { TypedUseLazyQuery } from '@reduxjs/toolkit/query/react';
import type { Id } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryType = TypedUseLazyQuery<any, any, any>;

type QueryOptions = {
  id?: Id;
  limit?: number;
  pause?: boolean;
  search?: string | URLSearchParams;
};

export interface FnSetLimit {
  (limit?: number): void;
}

export interface FnSetPaused {
  (paused: boolean): void;
}

interface Fn {
  (
    query: QueryType,
    options: QueryOptions,
  ): {
    initialLimit: number;
    setPaused: FnSetPaused;
    setRecordLimit: FnSetLimit;
  }
}

const useLimitedQuery: Fn = (query, options) => {
  const [paused, setPaused] = useState<boolean>(options.pause || false);
  const initialLimit = options.limit;
  const id = options.id;
  let search: string;

  if (options.search) {
    if (typeof options.search === 'string') {
      search = options.search;
    } else {
      search = `?${options.search.toString()}`;
    }
  }

  const [recordLimit, setRecordLimit] = useState<number>(initialLimit);
  const [trigger, result] = query();

  useEffect(() => {
    const lastArgs = result.originalArgs;

    if (paused) {
      return;
    }

    if (lastArgs?.id !== id || lastArgs?.limit !== recordLimit || lastArgs?.search !== search) {
      trigger({ id, limit: recordLimit, search });
    }
  }, [
    id,
    paused,
    recordLimit,
    result,
    search,
    trigger,
  ]);

  return {
    initialLimit,
    setPaused,
    setRecordLimit,
  };
};

export default useLimitedQuery;
