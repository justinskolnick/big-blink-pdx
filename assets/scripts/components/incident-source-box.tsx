import React, { useEffect } from 'react';

import { MetaSectionBox } from './meta-section';
import { iconName } from './sources/icon';
import ItemLink from './sources/item-link';

import { useGetSourceById } from '../reducers/sources';
import api from '../services/api';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
  title: string;
}

const IncidentSourceBox = ({ incident, title }: Props) => {
  const [trigger] = api.useLazyGetSourceByIdQuery();

  const id = incident?.sourceId;
  const source = useGetSourceById(id);

  const hasSource = Boolean(source);

  useEffect(() => {
    if (source || !id) return;

    trigger({ id });
  }, [id, source, trigger]);

  if (!hasSource) return null;

  return (
    <MetaSectionBox
      className='source-information-box'
      icon={iconName}
      title={title}
    >
      <ItemLink item={source}>
        {source.title}
      </ItemLink>
    </MetaSectionBox>
  );
};

export default IncidentSourceBox;
