import { useState } from 'react';

export interface FnSetLimit {
  (limit?: number): void;
}

const useSetLimit = (initialLimit: number) => {
  const [recordLimit, setRecordLimit] = useState<number>(initialLimit);

  return {
    initialLimit,
    recordLimit,
    setRecordLimit,
  };
};

export default useSetLimit;
