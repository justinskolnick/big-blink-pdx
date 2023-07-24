import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import fetchFromPath from '../lib/fetch-from-path';
import { RootState } from '../lib/store';

import { LinkToSource } from './links';
import StatBox from './stat-box';

import { selectors } from '../reducers/sources';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
  title: string;
}

const IncidentSourceBox = ({
  incident,
  title,
}: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const id = incident?.sourceId;
  const source = useSelector((state: RootState) => selectors.selectById(state, id));

  useEffect(() => {
    if (source || !id) return;

    if (!fetched.current) {
      fetchFromPath('/sources/' + id);
      fetched.current = true;
    }
  }, [fetched, location, id, source]);

  if (!incident || !source) return null;

  return (
    <StatBox title={title} icon='database'>
      <LinkToSource
        id={source.id}
      >
        {source.title}
      </LinkToSource>
    </StatBox>
  );
};

export default IncidentSourceBox;
