import { useEffect, useState } from 'react';

import type { TypedUseLazyQuery } from '@reduxjs/toolkit/query/react';
import type { Id } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryType = TypedUseLazyQuery<any, any, any>;

type QueryOptions = {
  id?: Id;
  limit?: number;
  search?: string;
};

export interface FnSetLimit {
  (limit?: number): void;
}

interface Fn {
  (
    query: QueryType,
    options: QueryOptions,
  ): {
    initialLimit: number;
    setRecordLimit: FnSetLimit;
  }
}

const useLimitedQuery: Fn = (query, options) => {
  const initialLimit = options.limit;
  const id = options.id;
  const search = options.search;

  const [recordLimit, setRecordLimit] = useState<number>(initialLimit);
  const [trigger, result] = query();

  useEffect(() => {
    const lastArgs = result.originalArgs;

    if (lastArgs?.id !== id || lastArgs?.limit !== recordLimit || lastArgs?.search !== search) {
      trigger({ id, limit: recordLimit, search });
    }
  }, [
    id,
    recordLimit,
    result,
    search,
    trigger,
  ]);

  return {
    initialLimit,
    setRecordLimit,
  };
};

export default useLimitedQuery;
