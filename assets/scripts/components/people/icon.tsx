import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import Icon from '../icon';

import { RootState } from '../../lib/store';

import { selectors } from '../../reducers/people';

import type { Person } from '../../types';

interface Props {
  person?: Person;
}

enum TypeForIcon {
  group = 'user-group',
  person = 'user-large',
  unknown = 'circle-question',
}

export const iconName = TypeForIcon.group;

const getIconName = (person?: Person) => TypeForIcon[person?.type ?? 'person'];

const PeopleIcon = ({ person }: Props) => {
  const { id } = useParams();
  const numericId = Number(id);
  const personAtId = useSelector((state: RootState) => selectors.selectById(state, numericId));

  const name = getIconName(person || personAtId);

  return <Icon name={name} />;
};

export default PeopleIcon;
