import React, { ReactNode } from 'react';

import { FilterLabel, FilterText } from './filter';
import { iconName } from './incidents/icon';
import ItemSubhead from './item-subhead';

import type { FiltersLabel } from '../types';

interface PrimaryAssociationProps {
  children?: ReactNode;
  label: FiltersLabel['value'];
}

interface Props {
  children?: ReactNode;
  label?: string;
  subtitle: ReactNode;
}

export const PrimaryAssociation = ({
  children,
  label,
}: PrimaryAssociationProps) => {
  if (!label) return null;

  return (
    <>
      <FilterText>associatied with</FilterText>
      {' '}
      <FilterLabel label={label} />
      {children && (
        <>
          {' '}
          {children}
        </>
      )}
    </>
  );
};

const IncidentsHeader = ({
  children,
  subtitle,
}: Props) => (
  <ItemSubhead
    className='incident-header'
    icon={iconName}
    title='Incidents'
    subtitle={subtitle}
  >
    {children}
  </ItemSubhead>
);

export default IncidentsHeader;
