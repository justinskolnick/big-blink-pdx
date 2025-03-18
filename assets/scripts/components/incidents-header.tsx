import React, { ReactNode } from 'react';

import ItemSubhead from './item-subhead';
import { LinkToQueryParams } from './links';

import type { IncidentFilterLabel, NewParams } from '../types';

type NewParamsKey = keyof NewParams;

interface AssociationLabelProps {
  label: IncidentFilterLabel;
}

interface AssociationLabelsProps {
  labels: IncidentFilterLabel[];
}

interface AssociationProps {
  filterKey?: NewParamsKey;
  filterKeys?: NewParamsKey[];
  intro?: string;
  label?: IncidentFilterLabel;
  labels?: IncidentFilterLabel[];
}

interface IncidentsHeaderProps {
  children?: ReactNode;
  label?: string;
}

const PAGE_PARAM_KEY = 'page';

const PrimaryAssociation = ({ label }: AssociationProps) => {
  if (!label) return null;

  return (
    <>
      associatied with{' '}
      <span className='incidents-association'>{label}</span>
    </>
  );
};

const AssociationLabel = ({ label }: AssociationLabelProps) => (
  <span className='incidents-association'>
    {label}
  </span>
);

const AssociationLabels = ({ labels }: AssociationLabelsProps) =>
  labels.map<ReactNode>((l, i) => (
    <AssociationLabel key={i} label={l} />
  )).reduce((prev, curr) => [prev, ' and ', curr]);

export const Association = ({
  filterKey,
  filterKeys,
  intro = 'and',
  label,
  labels,
}: AssociationProps) => {
  const hasFilterKeys = filterKeys?.length > 0;
  const hasLabels = labels?.length > 0;
  const hasFilterKey = Boolean(filterKey);
  const newParamKeys: NewParamsKey[] = [];

  if (hasFilterKeys) {
    filterKeys.forEach(key => {
      newParamKeys.push(key);
    });
  } else if (hasFilterKey) {
    newParamKeys.push(filterKey);
  }

  newParamKeys.push(PAGE_PARAM_KEY);

  const newParams = newParamKeys.reduce((all, key) => {
    all[key] = null;

    return all;
  }, {} as Record<NewParamsKey, null>);

  return (
    <h5>
      {intro}
      {' '}
      {hasLabels ? (
        <AssociationLabels labels={labels} />
      ) : (
        <AssociationLabel label={label} />
      )}
      {(hasFilterKeys || hasFilterKey) && (
        <>
          {' '}
          <LinkToQueryParams
            className='incidents-association-remove'
            newParams={newParams}
            replace={false}
            title='Remove this association'
          >
            &times;
          </LinkToQueryParams>
        </>
      )}
    </h5>
  );
};

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
