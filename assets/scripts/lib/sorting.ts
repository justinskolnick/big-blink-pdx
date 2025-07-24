import type { Source } from '../types';

const demoteIfQuarterIsNull = (obj: Source) => obj.quarter === null ? 5 : obj.quarter;

export const sortQuarterAscendingTypeDecending = (a: Source, b: Source) =>
  demoteIfQuarterIsNull(a) - demoteIfQuarterIsNull(b) || a.type.localeCompare(b.type);
