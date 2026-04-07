import type { SourceObject } from '../types';

const demoteIfQuarterIsNull = (obj: SourceObject) => {
  if ('quarter' in obj && obj.quarter) {
    return obj.quarter;
  }

  return 5;
};

export const sortQuarterAscendingTypeDecending = (a: SourceObject, b: SourceObject) =>
  demoteIfQuarterIsNull(a) - demoteIfQuarterIsNull(b) || a.type.localeCompare(b.type);
