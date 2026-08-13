import { useParams } from 'react-router';

import useSelector from '../hooks/use-app-selector';

import { getEntityById } from '../reducers/entities';
import { getPersonById } from '../reducers/people';
import { getSourceById } from '../reducers/sources';

import { getCurrent, getNullItem } from '../selectors';

import { RootState } from '../lib/store';

import type {
  Id,
  ItemDetailObject,
} from '../types';

interface ItemSelector {
  (id: Id): (state: RootState) => ItemDetailObject | null;
}

const useGetItemById = (providedId?: Id): ItemDetailObject | null => {
  const { id } = useParams();
  const numericId = Number(providedId || id);

  const current = useSelector(getCurrent);
  let selector: ItemSelector = getNullItem;

  if (numericId && current) {
    if (current.section === 'entities') {
      selector = getEntityById;
    } else if (current.section === 'people') {
      selector = getPersonById;
    } else if (current.section === 'sources') {
      selector = getSourceById;
    }
  }

  return useSelector(selector(numericId));
};

export default useGetItemById;
