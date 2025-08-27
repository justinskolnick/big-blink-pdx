import React, { useEffect } from 'react';

import EntityItemLink from './entities/item-link';

import { useGetEntityById } from '../reducers/entities';
import api from '../services/api';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
}

const IncidentEntity = ({ incident }: Props) => {
  const [trigger] = api.useLazyGetEntityByIdQuery();

  const id = incident.entityId;
  const entity = useGetEntityById(id);
  const hasEntity = Boolean(entity);

  useEffect(() => {
    if (entity || !id) return;

    trigger({ id });
  }, [id, entity, trigger]);

  return hasEntity ? (
    <EntityItemLink item={entity}>{entity.name}</EntityItemLink>
  ) : (
    <>{incident.entity}</>
  );
};

export default IncidentEntity;
