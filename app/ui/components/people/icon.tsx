import React from 'react';

import Icon from '../icon';

import type { Person } from '../../types';

interface Props {
  person: Person;
}

enum TypeForIcon {
  group = 'user-group',
  person = 'user-large',
  unknown = 'circle-question',
}

export const getIconName = (person: Person) => TypeForIcon[person.type];

const PersonIcon = ({ person }: Props) => {
  const iconName = getIconName(person);

  return <Icon name={iconName} />;
};

export default PersonIcon;
