import { ReactNode } from 'react';

import api from '../../services/api';

import type { TriggerFn } from '../../services/api';

interface IncidentsTriggerProps {
  children: (trigger: TriggerFn) => ReactNode;
}

const IncidentsTrigger = ({ children }: IncidentsTriggerProps) => {
  const [trigger] = api.useLazyGetSourceIncidentsByIdQuery();

  return children(trigger);
};

export default IncidentsTrigger;
