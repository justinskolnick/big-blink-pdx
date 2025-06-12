import React, { ReactNode } from 'react';

import { FilterLabel, FilterText } from './filter';
import { iconName } from './incidents/icon';
import ItemSubhead from './item-subhead';

import type { FiltersLabel } from '../types';

interface PrimaryAssociationProps {
  label: FiltersLabel['value'];
}

interface Props {
  children?: ReactNode;
  label?: string;
}

export const PrimaryAssociation = ({ label }: PrimaryAssociationProps) => {
  if (!label) return null;

  return (
    <>
      <FilterText>associatied with</FilterText>
      {' '}
      <span className='filter-label-set'>
        <FilterLabel label={label} />
      </span>
    </>
  );
};

const IncidentsHeader = ({
  children,
  label,
}: Props) => (
  <ItemSubhead
    className='incident-header'
    icon={iconName}
    title='Incidents'
    subtitle={<PrimaryAssociation label={label} />}
  >
    {children}
  </ItemSubhead>
);

export default IncidentsHeader;
