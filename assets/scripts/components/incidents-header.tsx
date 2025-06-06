import React, { useEffect, useState, Fragment, MouseEvent, ReactElement, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router';
import { cx } from '@emotion/css';

import { getQueryParams } from '../lib/links';
import { RootState } from '../lib/store';

import { iconName } from './incidents/icon';
import ItemSubhead from './item-subhead';
import { LinkToQueryParams } from './links';

import { selectors as entitiesSelectors } from '../reducers/entities';
import { selectors as peopleSelectors } from '../reducers/people';

import { Sections } from '../types';
import type {
  Id,
  IncidentsFiltersDateField,
  IncidentsFiltersDatesActionValue,
  IncidentsFiltersLabel,
  IncidentsFiltersLabelId,
  IncidentsFiltersObjects,
  NewParams,
} from '../types';

type NewParamsKey = keyof NewParams;

interface AssociationActionHandlerType {
  (event: MouseEvent, action?: IncidentsFiltersDatesActionValue): void;
}

interface SubmitHandler {
  (formData: FormData): void;
}

interface AssociationFilterProps {
  filter: IncidentsFiltersObjects;
}

interface AssociationLabelSetProps {
  children: ReactNode;
}

interface AssociationLabelProps {
  label: IncidentsFiltersLabel['value'];
}

interface AssociationActionProps {
  action?: IncidentsFiltersDatesActionValue;
  children: ReactNode;
  handleClick?: AssociationActionHandlerType;
  to?: string;
}

interface AssociationTextProps {
  children: ReactNode;
}

interface AssociationLabelsProps {
  filter: IncidentsFiltersObjects;
  handleActionClick?: AssociationActionHandlerType;
}

interface AssociationLabelArrayProps {
  handleActionClick?: AssociationActionHandlerType;
  labels: IncidentsFiltersLabel[];
  model?: Sections.Entities | Sections.People;
}

interface AssociationFormProps {
  action: IncidentsFiltersDatesActionValue;
  filter: IncidentsFiltersObjects;
  handleActionClick?: AssociationActionHandlerType;
  handleCancel: AssociationActionHandlerType;
}

interface AssociationsProps {
  children: ReactNode;
}

interface AssociationModelIdProps {
  label: IncidentsFiltersLabelId;
  model: Sections;
}

interface AssociationDateFieldProps {
  field: IncidentsFiltersDateField;
}

interface AssociationRemoveProps {
  newParams: NewParams;
}

interface IncidentsHeaderProps {
  children?: ReactNode;
  label?: string;
}

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

const PrimaryAssociation = ({ label }: AssociationLabelProps) => {
  if (!label) return null;

  return (
    <>
      <AssociationText>associatied with</AssociationText>
      {' '}
      <AssociationLabelSet>
        <AssociationLabel label={label} />
      </AssociationLabelSet>
    </>
  );
};

const Entity = ({ id }: { id: Id }) => {
  const entity = useSelector((state: RootState) => entitiesSelectors.selectById(state, id));

  if (!entity) return null;

  return <AssociationLabel label={entity.name} />;
};

const Person = ({ id }: { id: Id }) => {
  const person = useSelector((state: RootState) => peopleSelectors.selectById(state, id));

  if (!person) return null;

  return <AssociationLabel label={person.name} />;
};

const AssociationModelId = ({ label, model }: AssociationModelIdProps) => {
  if (model === Sections.Entities) {
    return <Entity id={label.value} />;
  } else if (model === Sections.People) {
    return <Person id={label.value} />;
  }

  return null;
};

const AssociationDateField = ({ field }: AssociationDateFieldProps) => (
  <input
    className='incidents-association-form-field'
    type='date'
    id={field.name}
    name={field.name}
  />
);

const AssociationLabelArray = ({ handleActionClick, labels, model }: AssociationLabelArrayProps) => labels.map((label, i) => (
  <Fragment key={i}>
    {label.type === 'id' && <AssociationModelId label={label} model={model} />}
    {label.type === 'input-date' && <AssociationDateField field={label} />}
    {label.type === 'label' && <AssociationLabel label={label.value} />}
    {label.type === 'link' && (
      <AssociationAction action={label.action} handleClick={handleActionClick}>
        {label.value}
      </AssociationAction>
    )}
    {label.type === 'text' && <AssociationText>{label.value}</AssociationText>}
  </Fragment>
)).reduce((prev: ReactElement, curr: ReactElement): any => [prev, ' ', curr]);

const AssociationForm = ({ action, filter, handleActionClick, handleCancel }: AssociationFormProps) => {
  const { fields } = filter;

  const hasFields = Boolean(fields);
  const hasAction = hasFields && action in fields;
  const actionFields = hasAction && fields[action];

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const handleSubmit: SubmitHandler = (formData) => {
    const formParams = Object.fromEntries(formData.entries());
    const params = {
      ...formParams,
      page: null,
    } as NewParams;
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
        type='button'
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
  const newParamsBase = {
    page: null,
  } as Record<NewParamsKey, null>;
  const newParams = hasValues && Object.keys(values).reduce((all, key: NewParamsKey) => {
    all[key] = null;

    return all;
  }, newParamsBase);

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

export const AssociationFilter = ({ filter }: AssociationFilterProps) => {
  const hasFilter = Boolean(filter);
  const hasFields = hasFilter && 'fields' in filter;
  const hasValues = hasFilter && 'values' in filter;

  const [activeAction, setActiveAction] = useState<IncidentsFiltersDatesActionValue>(null);

  const clearAction = () => setActiveAction(null);

  const handleActionClick: AssociationActionHandlerType = (e, action) => {
    e.preventDefault();

    if (action) {
      setActiveAction(action);
    }
  };
  const handleCancelActionClick: AssociationActionHandlerType = (e) => {
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

const IncidentsHeader = ({
  children,
  label,
}: IncidentsHeaderProps) => (
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
