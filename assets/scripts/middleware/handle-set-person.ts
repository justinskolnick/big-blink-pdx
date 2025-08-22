import type { Person } from '../types';
import { MiddlewareHandlerFn } from '../types';

export const hasPernr = (person: Person) => person.pernr !== null;

export const lookupOfficialPositions = (person: Person) => {
  console.log('->',person.id);
};

const handleSetPerson: MiddlewareHandlerFn = (store, action) => {
  const { payload } = action;
  const person = payload as Person;

  if (hasPernr(person)) {
    lookupOfficialPositions(person);
  }
};

export default handleSetPerson;
