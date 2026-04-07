import type { PayloadAction } from '@reduxjs/toolkit';

import type { ListenerAPI } from '../lib/store';

import { hasPernr, lookupOfficialPositionsForId } from './handle-set-person';

import type { PersonObject } from '../types';

const handleSetPeople = (action: PayloadAction<PersonObject[]>, state: ListenerAPI) => {
  const { payload } = action;

  const people = payload;

  const peopleWithPernr = people.filter(hasPernr);
  const ids = peopleWithPernr.map(person => person.id);

  lookupOfficialPositionsForId(state, ids);
};

export default handleSetPeople;
