import { useEffect, useState, Dispatch, SetStateAction } from 'react';

import { isObject } from '../lib/util';

import type { TypedUseLazyQuery } from '@reduxjs/toolkit/query/react';
import type { GenericObject, Id } from '../types';

export type ApiQueryType = TypedUseLazyQuery<any, any, any>;

export type SearchValue = string | GenericObject | URLSearchParams | undefined;

type QueryOptions = {
  id?: Id;
  limit: number;
  pause?: boolean;
  search: SearchValue;
};

export type FnSetLimit = Dispatch<SetStateAction<number>>;
export type FnSetPaused = Dispatch<SetStateAction<boolean>>;
export type LimitedQueryReturnType = {
  currentLimit: number;
  initialLimit: number;
  setPaused: FnSetPaused;
  setRecordLimit: FnSetLimit;
};

const useLimitedQuery = (query: ApiQueryType, options: QueryOptions): LimitedQueryReturnType => {
  const [paused, setPaused] = useState<boolean>(options.pause || false);
  const initialLimit = options.limit;
  const id = options.id;
  let search: SearchValue = undefined;

  if (options.search) {
    if (typeof options.search === 'string') {
      search = options.search;
    } else if (isObject(options.search)) {
      search = new URLSearchParams(options.search);
    }

    if (search) {
      search = `?${search.toString()}`;
    }
  }

  const [recordLimit, setRecordLimit] = useState<number>(initialLimit);
  const [trigger, result] = query();

  useEffect(() => {
    const lastArgs = result.originalArgs;
    const hasChanged = lastArgs?.id !== id || lastArgs?.limit !== recordLimit || lastArgs?.search !== search;

    if (paused) {
      return;
    }

    if (hasChanged) {
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
    currentLimit: recordLimit,
    initialLimit,
    setPaused,
    setRecordLimit,
  };
};

export default useLimitedQuery;
