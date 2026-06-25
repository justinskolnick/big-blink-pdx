import api, { type TriggerChildren } from '../../services/api';

interface IncidentsTriggerProps {
  children: TriggerChildren;
}

const IncidentsTrigger = ({ children }: IncidentsTriggerProps) => {
  const [trigger] = api.useLazyGetEntityIncidentsByIdQuery();

  return children(trigger);
};

export default IncidentsTrigger;
