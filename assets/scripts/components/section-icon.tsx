import React from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';
import EntitiesIcon from './entities/icon';
import IncidentsIcon from './incidents/icon';
import PeopleIcon from './people/icon';
import SourcesIcon from './sources/icon';

import { Sections } from '../types';

interface Props {
  name?: IconName;
  slug: string;
}

const SectionIcon = ({ name, slug }: Props) => {
  if (name) {
    return <Icon name={name} />;
  } else if (slug === Sections.Entities) {
    return <EntitiesIcon />;
  } else if (slug === Sections.Incidents) {
    return <IncidentsIcon />;
  } else if (slug === Sections.People) {
    return <PeopleIcon />;
  } else if (slug === Sections.Sources) {
    return <SourcesIcon />;
  }

  return null;
};

export default SectionIcon;
