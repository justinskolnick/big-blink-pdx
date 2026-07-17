import type { SourceObject } from '../types';

const demoteIfQuarterAndMonthAreNull = (obj: SourceObject): number => {
  if ('quarter' in obj && obj.quarter) {
    return obj.quarter;
  } else if ('month' in obj && obj.month) {
    return obj.month;
  }

  return 10;
};

export const sortSourceDateAscendingTypeDecending = (a: SourceObject, b: SourceObject) =>
  demoteIfQuarterAndMonthAreNull(a) - demoteIfQuarterAndMonthAreNull(b) || a.type.localeCompare(b.type);
