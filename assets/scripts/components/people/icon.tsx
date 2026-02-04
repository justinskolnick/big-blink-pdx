import React from 'react';
import { useParams } from 'react-router';

import Icon from '../icon';

import { useGetPersonById } from '../../reducers/people';

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

  const personAtId = useGetPersonById(numericId);

  const name = getIconName(person || personAtId);

  return <Icon name={name} />;
};

export default PeopleIcon;
