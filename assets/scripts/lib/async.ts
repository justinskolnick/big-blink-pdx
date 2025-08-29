import { sleep } from './util';

interface FnBatchPromiseAll {
  <Type>(
    items: Array<Type>,
    callback: (item: Type) => unknown,
    increment?: number,
    delay?: number
  ): Promise<(PromiseRejectedResult | PromiseFulfilledResult<unknown>)[]>;
}

export const batchPromiseAll: FnBatchPromiseAll = async (items, callback, increment = 5, delay = 250) => {
  const allResults = [];
  let index = 0;

  while (index < items.length) {
    const batchItems = items.slice(index, index + increment);
    const results = await Promise.allSettled(batchItems.map(item => callback(item)));

    allResults.push(...results);
    index = index + increment;

    await sleep(delay);
  }

  return allResults;
};
