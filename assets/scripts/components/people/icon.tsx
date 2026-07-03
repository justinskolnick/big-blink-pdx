import React from 'react';

import Icon from '../icon';

import type { PersonObject } from '../../types';

interface Props {
  item?: PersonObject;
}

enum TypeForIcon {
  group = 'user-group',
  person = 'user-large',
  unknown = 'circle-question',
}

export const iconName = TypeForIcon.group;

const getIconName = (item?: PersonObject) => TypeForIcon[item?.type ?? 'person'];

const PeopleIcon = ({ item }: Props) => {
  const name = getIconName(item);

  return <Icon name={name} />;
};

export default PeopleIcon;
