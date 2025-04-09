import React, { ReactNode } from 'react';

import ItemSubhead from './item-subhead';
import { LinkToQueryParams } from './links';

import type { IncidentFilterLabel, NewParams } from '../types';

type NewParamsKey = keyof NewParams;

interface AssociationSingleProps {
  label: IncidentFilterLabel;
}

interface AssociationMultipleProps {
  labels: IncidentFilterLabel[];
}

interface AssociationLabelSetProps {
  children: ReactNode;
}

interface AssociationLabelProps {
  label: IncidentFilterLabel;
}

interface AssociationProps {
  filterKey?: NewParamsKey;
  filterKeys?: NewParamsKey[];
  intro?: string;
  label?: IncidentFilterLabel;
  labels?: IncidentFilterLabel[];
}

interface AssociationsProps {
  children: ReactNode;
}

interface AssociationRemoveProps {
  newParams: NewParams;
}

interface IncidentsHeaderProps {
  children?: ReactNode;
  label?: string;
}

const PAGE_PARAM_KEY = 'page';

const AssociationLabelSet = ({ children }: AssociationLabelSetProps) => (
  <span className='incidents-association-label-set'>
    {children}
  </span>
);

const AssociationLabel = ({ label }: AssociationLabelProps) => (
  <span className='incidents-association-label'>
    {label}
  </span>
);

const AssociationSingle = ({ label }: AssociationSingleProps) => (
  <AssociationLabelSet>
    <AssociationLabel label={label} />
  </AssociationLabelSet>
);

const AssociationMultiple = ({ labels }: AssociationMultipleProps) => (
  <AssociationLabelSet>
    {labels.map<ReactNode>((l, i) => (
      <AssociationLabel key={i} label={l} />
    )).reduce((prev, curr) => [prev, ' and ', curr])}
  </AssociationLabelSet>
);

const AssociationRemove = ({ newParams }: AssociationRemoveProps) => (
  <LinkToQueryParams
    className='incidents-association-remove'
    newParams={newParams}
    replace={false}
    title='Remove this association'
  >
    &times;
  </LinkToQueryParams>
);

const PrimaryAssociation = ({ label }: AssociationProps) => {
  if (!label) return null;

  return (
    <>
      associatied with{' '}
      <AssociationSingle label={label} />
    </>
  );
};

export const Associations = ({ children }: AssociationsProps) => (
  <div className='incidents-associations'>
    {children}
  </div>
);

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
    <div className='incidents-association'>
      {intro}
      {' '}
      {hasLabels ? (
        <AssociationMultiple labels={labels} />
      ) : (
        <AssociationSingle label={label} />
      )}
      {(hasFilterKeys || hasFilterKey) && (
        <>
          {' '}
          <AssociationRemove newParams={newParams} />
        </>
      )}
    </div>
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
