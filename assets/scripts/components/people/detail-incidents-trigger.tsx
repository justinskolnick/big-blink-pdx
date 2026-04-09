import { ReactNode } from 'react';

import api, { type LazyTriggerFn } from '../../services/api';

interface IncidentsTriggerProps {
  children: (trigger: LazyTriggerFn) => ReactNode;
}

const IncidentsTrigger = ({ children }: IncidentsTriggerProps) => {
  const [trigger] = api.useLazyGetPersonIncidentsByIdQuery();

  return children(trigger);
};

export default IncidentsTrigger;
