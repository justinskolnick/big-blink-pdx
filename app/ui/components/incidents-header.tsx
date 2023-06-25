import React, { ReactNode } from 'react';
import { css } from '@emotion/css';

import ItemSubhead from './item-subhead';
import { LinkToQueryParams } from './links';

interface AssociationProps {
  filterKey?: string;
  intro?: string;
  label: string;
}

interface IncidentsHeaderProps {
  children?: ReactNode;
  label?: string;
}

const styles = css`
  display: inline-block;

  h4, h5 {
    display: inline;
  }

  .incidents-association {
    font-weight: 600;
  }

  .incidents-association-remove {
    color: var(--color-danger);
    font-weight: 600;

    &:hover {
      border-bottom-color: var(--color-danger);
    }
  }
`;

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
    className={styles}
    title='Incidents'
    subtitle={<PrimaryAssociation label={label} />}
  >
    {children}
  </ItemSubhead>
);

export default IncidentsHeader;
