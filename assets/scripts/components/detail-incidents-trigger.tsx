import useSelector from '../hooks/use-app-selector';

import { getCurrent } from '../selectors';

import api, { type TriggerChildren } from '../services/api';

interface IncidentsTriggerProps {
  children: TriggerChildren;
}

const useGetTrigger = () => {
  const current = useSelector(getCurrent);

  let query;

  if (current) {
    if (current.section === 'entities') {
      query = api.useLazyGetEntityIncidentsByIdQuery();
    } else if (current.section === 'people') {
      query = api.useLazyGetPersonIncidentsByIdQuery();
    } else if (current.section === 'sources') {
      query = api.useLazyGetSourceIncidentsByIdQuery();
    }
  }

  if (query) {
    const [trigger] = query;

    return trigger;
  }

  return null;
};

const IncidentsTrigger = ({ children }: IncidentsTriggerProps) => {
  const trigger = useGetTrigger();

  if (!trigger) return null;

  return children(trigger);
};

export default IncidentsTrigger;
