import React from 'react';

import Icon from '../icon';

import type { SourceObject } from '../../types';

interface Props {
  item?: SourceObject;
}

enum TypeForIcon {
  source = 'database',
  csv = 'file-csv',
  excel = 'file-excel',
  pdf = 'file-pdf',
}

export const iconName = TypeForIcon.source;

const getIconName = (item?: SourceObject) => TypeForIcon[item?.format ?? 'source'];

const SourcesIcon = ({ item }: Props) => {
  const name = getIconName(item);

  return (
    <Icon name={name} />
  );
};

export default SourcesIcon;
