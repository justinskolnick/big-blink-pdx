import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../lib/store';

import { MetaSectionBox } from './meta-section';
import { LinkToSource } from './links';

import { selectors } from '../reducers/sources';
import api from '../services/api';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
  title: string;
}

const IncidentSourceBox = ({ incident, title }: Props) => {
  const [trigger] = api.useLazyGetSourceByIdQuery();

  const id = incident?.sourceId;
  const source = useSelector((state: RootState) => selectors.selectById(state, id));

  useEffect(() => {
    if (source || !id) return;

    trigger(id);
  }, [id, source, trigger]);

  if (!source) return null;

  return (
    <MetaSectionBox
      className='incident-source-box'
      icon='database'
      title={title}
    >
      <LinkToSource
        id={source.id}
      >
        {source.title}
      </LinkToSource>
    </MetaSectionBox>
  );
};

export default IncidentSourceBox;
