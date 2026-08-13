import { useParams } from 'react-router';

import useSelector from '../hooks/use-app-selector';

import { useGetEntityById } from '../reducers/entities';
import { useGetPersonById } from '../reducers/people';
import { useGetSourceById } from '../reducers/sources';

import { getCurrent } from '../selectors';

import type {
  ItemDetailObject,
  Id,
} from '../types';

const useGetItemById = (providedId?: Id): ItemDetailObject | null => {
  const { id } = useParams();
  const numericId = Number(providedId || id);

  const current = useSelector(getCurrent);

  if (numericId && current) {
    if (current.section === 'entities') {
      return useGetEntityById(numericId);
    } else if (current.section === 'people') {
      return useGetPersonById(numericId);
    } else if (current.section === 'sources') {
      return useGetSourceById(numericId);
    }
  }

  return null;
};

export default useGetItemById;
