import React, { useEffect, useState, Fragment, MouseEvent, ReactElement, ReactNode } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { cx } from '@emotion/css';

import { getQueryParams } from '../lib/links';
import { isEmpty } from '../lib/util';

import { LinkToQueryParams } from './links';

import { useGetEntityById } from '../reducers/entities';
import { useGetPersonById } from '../reducers/people';

import { FiltersLabelTypes, Sections } from '../types';
import type {
  FiltersDateField,
  FiltersDatesActionValue,
  FiltersLabel,
  FiltersLabelId,
  FiltersObjects,
  Id,
  NewParams,
} from '../types';

type NewParamsKey = keyof NewParams;

interface FilterActionHandlerType {
  (event: MouseEvent, action?: FiltersDatesActionValue): void;
}

interface SubmitHandler {
  (formData: FormData): void;
}

interface FiltersProps {
  children: ReactNode;
  className?: string;
}

interface FilterBaseProps {
  children?: ReactNode;
  filterRelated?: FiltersObjects;
  inline?: boolean;
}

interface FilterTagProps extends FilterBaseProps {
  filter: FiltersObjects;
}

interface FilterProps extends FilterBaseProps {
  filter: FiltersObjects | FiltersObjects[];
}

interface FilterActionProps {
  action?: FiltersDatesActionValue;
  children: ReactNode;
  handleClick?: FilterActionHandlerType;
  to?: string;
}

interface FilterLabelProps {
  label: FiltersLabel['value'];
}

interface FilterTextProps {
  children: ReactNode;
}

interface FilterLabelsProps {
  filter: FiltersObjects;
  handleActionClick?: FilterActionHandlerType;
  filterRelated: FiltersObjects;
}

interface FilterLabelArrayProps {
  handleActionClick?: FilterActionHandlerType;
  labels: FiltersLabel[];
  model?: Sections.Entities | Sections.People;
}

interface FilterFormProps {
  action: FiltersDatesActionValue;
  filter: FiltersObjects;
  handleActionClick?: FilterActionHandlerType;
  handleCancel: FilterActionHandlerType;
}

interface FilterModelIdProps {
  label: FiltersLabelId;
  model: Sections;
}

interface FilterDateFieldProps {
  field: FiltersDateField;
}

interface FilterRemoveProps {
  newParams: NewParams;
}

const FilterAction = ({ action, children, handleClick }: FilterActionProps) => {
  const hasAction = Boolean(action);

  return (
    <span className='filter-link' onClick={hasAction ? e => handleClick(e, action) : null}>
      {children}
    </span>
  );
};

export const FilterLabel = ({ label }: FilterLabelProps) => (
  <span className='filter-label'>
    {label}
  </span>
);

export const FilterText = ({ children }: FilterTextProps) => (
  <span className='filter-text'>
    {children}
  </span>
);

const FilterRemove = ({ newParams }: FilterRemoveProps) => (
  <LinkToQueryParams
    className='filter-remove'
    newParams={newParams}
    replace={false}
    title='Remove this association'
  >
    &times;
  </LinkToQueryParams>
);

const Entity = ({ id }: { id: Id }) => {
  const entity = useGetEntityById(id);

  const hasEntity = Boolean(entity);

  if (!hasEntity) return null;

  return <FilterLabel label={entity.name} />;
};

const Person = ({ id }: { id: Id }) => {
  const person = useGetPersonById(id);

  const hasPerson = Boolean(person);

  if (!hasPerson) return null;

  return <FilterLabel label={person.name} />;
};

const FilterModelId = ({ label, model }: FilterModelIdProps) => {
  if (model === Sections.Entities) {
    return <Entity id={label.value} />;
  } else if (model === Sections.People) {
    return <Person id={label.value} />;
  }

  return null;
};

const FilterDateField = ({ field }: FilterDateFieldProps) => (
  <input
    className='filter-form-field'
    type='date'
    id={field.name}
    name={field.name}
  />
);

const FilterLabelArray = ({ handleActionClick, labels, model }: FilterLabelArrayProps) => labels.map((label, i) => (
  <Fragment key={i}>
    {label.type === FiltersLabelTypes.Id && <FilterModelId label={label} model={model} />}
    {label.type === FiltersLabelTypes.InputDate && <FilterDateField field={label} />}
    {label.type === FiltersLabelTypes.Label && <FilterLabel label={label.value} />}
    {label.type === FiltersLabelTypes.Link && (
      <FilterAction action={label.action} handleClick={handleActionClick}>
        {label.value}
      </FilterAction>
    )}
    {label.type === FiltersLabelTypes.Text && <FilterText>{label.value}</FilterText>}
  </Fragment>
)).reduce((prev: ReactElement, curr: ReactElement): any => [prev, ' ', curr]);

const FilterForm = ({ action, filter, handleActionClick, handleCancel }: FilterFormProps) => {
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
    <form className='filter-form' action={handleSubmit}>
      <fieldset className='filter-form-fieldset'>
        <FilterLabelArray labels={actionFields} handleActionClick={handleActionClick} />
      </fieldset>

      <button
        className='filter-form-button filter-form-submit'
        type='submit'
      >
        Submit
      </button>
      <button
        className='filter-form-button filter-form-cancel'
        onClick={handleCancel}
        type='button'
      >
        &times;
      </button>
    </form>
  );
};

const FilterLabels = ({ filter, filterRelated, handleActionClick }: FilterLabelsProps) => {
  const hasOtherFilter = Boolean(filterRelated);

  const hasValues = Boolean(filter.values);
  const isRemovable = hasValues && !isEmpty(filter.values);
  const newParamsBase = {
    page: null,
  } as Record<NewParamsKey, null>;
  let newParams = newParamsBase;

  if (hasValues) {
    const keys = Object.keys(filter.values);
    const otherKeys = Object.keys(filterRelated?.values ?? {});

    newParams = [].concat(keys, otherKeys).reduce((all, key: NewParamsKey) => {
      all[key] = null;

      return all;
    }, newParamsBase);
  }

  return (
    <>
      <FilterLabelArray
        labels={filter.labels}
        model={filter.model}
        handleActionClick={handleActionClick}
      />
      {hasOtherFilter && (
        <>
          {' '}
          <FilterLabelArray
            labels={filterRelated.labels}
            model={filterRelated.model}
          />
        </>
      )}
      {isRemovable && (
        <>
          {' '}
          <FilterRemove newParams={newParams} />
        </>
      )}
    </>
  );
};

export const FilterIntro = ({ children }: FilterTextProps) => (
  <div className='filter-intro'>
    {children}
  </div>
);

export const Filters = ({ children, className }: FiltersProps) => (
  <div className={cx('filters', className)}>
    {children}
  </div>
);

const FilterTag = ({ children, filter, filterRelated, inline }: FilterTagProps) => {
  const hasFilter = Boolean(filter);
  const hasFields = hasFilter && 'fields' in filter;
  const hasValues = hasFilter && 'values' in filter;

  const [activeAction, setActiveAction] = useState<FiltersDatesActionValue>(null);

  const clearAction = () => setActiveAction(null);

  const hasActiveAction = Boolean(activeAction);

  const handleActionClick: FilterActionHandlerType = (e, action) => {
    e.preventDefault();

    if (action) {
      setActiveAction(action);
    }
  };
  const handleCancelActionClick: FilterActionHandlerType = (e) => {
    e.preventDefault();

    clearAction();
  };

  const Tag = inline ? 'span' : 'div';

  useEffect(() => {
    if (hasValues) {
      clearAction();
    }
  }, [hasValues, clearAction]);

  if (!hasFilter) return null;

  return (
    <Tag className={cx('filter', !hasValues && 'filter-option')}>
      {hasActiveAction && !hasValues && hasFields ? (
        <FilterForm
          filter={filter}
          action={activeAction}
          handleCancel={handleCancelActionClick}
          handleActionClick={handleActionClick}
        />
      ) : (
        <FilterLabels
          filter={filter}
          filterRelated={filterRelated}
          handleActionClick={handleActionClick}
        />
      )}
      {children && (
        <>
          {' '}
          {children}
        </>
      )}
    </Tag>
  );
};

const Filter = ({ children, filter, filterRelated, inline }: FilterProps) => {
  if (Array.isArray(filter)) {
    return filter.map((entry, i) => (
      <FilterTag
        filter={entry}
        filterRelated={filterRelated}
        inline={inline}
        key={i}
      >
        {children}
      </FilterTag>
    ));
  }

  return (
    <FilterTag
      filter={filter}
      filterRelated={filterRelated}
      inline={inline}
    >
      {children}
    </FilterTag>
  );
};

export default Filter;
