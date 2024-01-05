import type { Source } from '../types';

export const sortQuarterAscendingTypeDecending = (a: Source, b: Source) => a.quarter - b.quarter || b.type.localeCompare(a.type);
