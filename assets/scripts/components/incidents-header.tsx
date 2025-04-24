import React, { useEffect, useState, Fragment, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router';
import { cx } from '@emotion/css';

import { getQueryParams } from '../lib/links';
import { RootState } from '../lib/store';

import ItemSubhead from './item-subhead';
import { LinkToQueryParams } from './links';

import { selectors as entitiesSelectors } from '../reducers/entities';
import { selectors as peopleSelectors } from '../reducers/people';

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
  children: ReactNode;
}

type AssociationActionHandlerType = (event?: ReactMouseEvent, action: string) => void;

interface AssociationActionProps {
  action?: string;
  children: ReactNode;
  handleClick?: AssociationActionHandlerType;
  to?: string;
}

interface AssociationTextProps {
  children: ReactNode;
}

interface AssociationLabelsProps {
  filter: any; // todo
  handleClick?: AssociationActionHandlerType;
}

interface AssociationFormProps {
  action: string;
  filter: any; // todo
  handleActionClick?: AssociationActionHandlerType;
  handleCancel: () => void;
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

const AssociationLabel = ({ children }: AssociationLabelProps) => (
  <span className='incidents-association-label'>
    {children}
  </span>
);

const AssociationAction = ({ action, children, handleClick }: AssociationActionProps) => {
  const hasAction = Boolean(action);

  return (
    <span className='incidents-association-link' onClick={hasAction ? e => handleClick(e, action) : null}>
      {children}
    </span>
  );
};

const AssociationText = ({ children }: AssociationTextProps) => (
  <span className='incidents-association-text'>
    {children}
  </span>
);

const AssociationSingle = ({ label }: AssociationSingleProps) => (
  <AssociationLabelSet>
    <AssociationLabel>{label}</AssociationLabel>
  </AssociationLabelSet>
);

const AssociationMultiple = ({ labels }: AssociationMultipleProps) => (
  <AssociationLabelSet>
    {labels.map<ReactNode>((l, i) => (
      <AssociationLabel key={i}>{l}</AssociationLabel>
    )).reduce((prev, curr) => [prev, (
      <Fragment key='conjunction'>
        {' '}
        <AssociationText>and</AssociationText>
        {' '}
      </Fragment>
    ), curr])}
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
      <AssociationText>associatied with</AssociationText>
      {' '}
      <AssociationSingle label={label} />
    </>
  );
};

const Entity = ({ id }) => {
  const entity = useSelector((state: RootState) => entitiesSelectors.selectById(state, id));

  if (!entity) return null;

  return <AssociationLabel>{entity.name}</AssociationLabel>;
};

const Person = ({ id }) => {
  const person = useSelector((state: RootState) => peopleSelectors.selectById(state, id));

  if (!person) return null;

  return <AssociationLabel>{person.name}</AssociationLabel>;
};

const AssociationModelId = ({ label, model }) => {
  if (model === 'entities') {
    return <Entity id={label.value} />;
  } else if (model === 'people') {
    return <Person id={label.value} />;
  }

  return null;
};

const AssociationDateField = ({ field }) => (
  <input
    className='incidents-association-form-field'
    type='date'
    id={field.name}
    name={field.name}
  />
);

const AssociationLabelArray = ({ handleActionClick, labels, model }) => labels.map((label, i) => (
  <Fragment key={i}>
    {label.type === 'id' && <AssociationModelId label={label} model={model} />}
    {label.type === 'input-date' && <AssociationDateField field={label} />}
    {label.type === 'label' && <AssociationLabel>{label.value}</AssociationLabel>}
    {label.type === 'link' && (
      <AssociationAction action={label.action} handleClick={handleActionClick}>
        {label.value}
      </AssociationAction>
    )}
    {label.type === 'text' && <AssociationText>{label.value}</AssociationText>}
  </Fragment>
)).reduce((prev, curr) => [prev, ' ', curr]);

const AssociationForm = ({ action, filter, handleActionClick, handleCancel }: AssociationFormProps) => {
  const { fields } = filter;

  const hasFields = Boolean(fields);
  const hasAction = hasFields && action in fields;
  const actionFields = hasAction && fields[action];

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const handleSubmit = formData => {
    const params = Object.fromEntries(formData.entries());
    const queryParams = getQueryParams(location, params, false);

    setSearchParams(queryParams.searchParams);
  };

  return (
    <form className='incidents-association-form' action={handleSubmit}>
      <fieldset className='incidents-association-form-fieldset'>
        <AssociationLabelArray labels={actionFields} handleActionClick={handleActionClick} />
      </fieldset>

      <button
        className='incidents-association-form-button incidents-association-form-submit'
        type='submit'
      >
        Submit
      </button>
      <button
        className='incidents-association-form-button incidents-association-form-cancel'
        onClick={handleCancel}
        type='cancel'
      >
        &times;
      </button>
    </form>
  );
};

const AssociationLabels = ({ filter, handleActionClick }: AssociationLabelsProps) => {
  const { labels, model, values } = filter;

  const hasValues = Boolean(values);
  const isRemovable = hasValues && Object.values(values).length > 0;
  const newParams = hasValues && Object.keys(values).reduce((all, key) => {
    all[key] = null;

    return all;
  }, {} as Record<NewParamsKey, null>);

  return (
    <>
      <AssociationLabelArray labels={labels} model={model} handleActionClick={handleActionClick} />
      {isRemovable && (
        <>
          {' '}
          <AssociationRemove newParams={newParams} />
        </>
      )}
    </>
  );
};

export const AssociationFilter = ({ filter }) => {
  const hasFilter = Boolean(filter);
  const hasFields = hasFilter && 'fields' in filter;
  const hasValues = hasFilter && 'values' in filter;
  // const hasFields = hasFilter && 'fields' in filter;

  const [activeAction, setActiveAction] = useState(null);

  const clearAction = () => setActiveAction(null);

  const handleActionClick = (e, action) => {
    e.preventDefault();

    if (action) {
      setActiveAction(action);
    }
  };
  const handleCancelActionClick = e => {
    e.preventDefault();

    clearAction();
  };

  const hasActiveAction = Boolean(activeAction);

  useEffect(() => {
    if (hasValues) {
      clearAction();
    }
  }, [hasValues, clearAction]);

  if (!hasFilter) return null;

  return (
    <div className={cx('incidents-association', !hasValues && 'incidents-association-option')}>
      {hasActiveAction && !hasValues && hasFields ? (
        <AssociationForm filter={filter} action={activeAction} handleCancel={handleCancelActionClick} handleActionClick={handleActionClick} />
      ) : (
        <AssociationLabels filter={filter} handleActionClick={handleActionClick} />
      )}
    </div>
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
      <AssociationText>{intro}</AssociationText>
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
