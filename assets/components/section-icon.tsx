import React from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';
import EntitiesIcon from './entities/icon';
import IncidentsIcon from './incidents/icon';
import PeopleIcon from './people/icon';
import SourcesIcon from './sources/icon';

const ENTITIES = 'entities' as const;
const INCIDENTS = 'incidents' as const;
const PEOPLE = 'people' as const;
const SOURCES = 'sources' as const;

interface Props {
  name?: IconName;
  slug?: string;
}

const SectionIcon = ({ name, slug }: Props) => {
  if (name) {
    return <Icon name={name} />;
  } else if (slug === ENTITIES) {
    return <EntitiesIcon />;
  } else if (slug === INCIDENTS) {
    return <IncidentsIcon />;
  } else if (slug === PEOPLE) {
    return <PeopleIcon />;
  } else if (slug === SOURCES) {
    return <SourcesIcon />;
  }

  return null;
};

export default SectionIcon;
