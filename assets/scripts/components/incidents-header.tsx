import React, { ReactNode } from 'react';

import ItemSubhead from './item-subhead';
import { LinkToQueryParams } from './links';

import type { IncidentFilterLabel } from '../types';

interface AssociationProps {
  filterKey?: string;
  intro?: string;
  label: IncidentFilterLabel;
}

interface IncidentsHeaderProps {
  children?: ReactNode;
  label?: string;
}

const PrimaryAssociation = ({ label }: AssociationProps) => {
  if (!label) return null;

  return (
    <>
      associatied with{' '}
      <span className='incidents-association'>{label}</span>
    </>
  );
};

export const Association = ({
  filterKey,
  intro = 'and',
  label,
}: AssociationProps) => (
  <h5>
    {intro}
    {' '}
    <span className='incidents-association'>
      {label}
    </span>
    {filterKey && (
      <>
        {' '}
        <LinkToQueryParams
          className='incidents-association-remove'
          newParams={{ [filterKey]: null }}
          replace={false}
          title='Remove this association'
        >
          &times;
        </LinkToQueryParams>
      </>
    )}
  </h5>
);

const IncidentsHeader = ({
  children,
  label,
}: IncidentsHeaderProps) => (
  <ItemSubhead
    className='incident-header'
    title='Incidents'
    subtitle={<PrimaryAssociation label={label} />}
  >
    {children}
  </ItemSubhead>
);

export default IncidentsHeader;
