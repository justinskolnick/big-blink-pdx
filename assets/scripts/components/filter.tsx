import React, { useEffect, useRef, useState, Fragment, MouseEvent, ReactElement, ReactNode, SubmitEvent } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { cx } from '@emotion/css';

import { getQueryParams } from '../lib/links';
import { isEmpty } from '../lib/util';

import Icon from './icon';
import { LinkToQueryParams } from './links';

import { useGetEntityById } from '../reducers/entities';
import { useGetPersonById } from '../reducers/people';

import { FiltersLabelTypes, Sections } from '../types';
import type {
  FiltersDateField,
  FiltersActionValue,
  FiltersLabel,
  FiltersLabelId,
  FiltersLabelWithName,
  FiltersObjects,
  FiltersSearchField,
  FiltersSelectField,
  FilterStringValue,
  FiltersValues,
  Id,
  NewFilterParams,
  PaginationParams,
  RefInputElement,
} from '../types';

type NewFilterAndPaginationParams = NewFilterParams & PaginationParams;
type FiltersValuesKeys = keyof FiltersValues;

interface FilterActionHandlerType {
  (event?: MouseEvent, action?: FiltersActionValue): void;
}

interface SubmitHandler {
  (event: SubmitEvent<HTMLFormElement>): void;
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
  filter?: FiltersObjects;
}

interface FilterProps extends FilterBaseProps {
  filter?: FiltersObjects | FiltersObjects[];
}

interface FilterActionProps {
  action?: FiltersActionValue;
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
  filterRelated?: FiltersObjects;
  handleActionClick?: FilterActionHandlerType;
  handleEditClick?: FilterActionHandlerType;
  handleRemoveClick?: FilterActionHandlerType;
  isEditable?: boolean;
}

interface FilterLabelArrayProps {
  handleActionClick?: FilterActionHandlerType;
  labels: FiltersLabel[];
  model?: Sections.Entities | Sections.People;
}

interface FilterFormProps {
  action: FiltersActionValue | null;
  filter: FiltersObjects;
  handleActionClick?: FilterActionHandlerType;
  handleCancel: FilterActionHandlerType;
  setIsEditable: (value: boolean) => void;
}

interface FilterModelIdProps {
  label: FiltersLabelId;
  model?: Sections;
}

interface FilterDateFieldProps {
  field: FiltersDateField;
}

interface FilterSearchFieldProps {
  field: FiltersSearchField;
}

interface FilterSelecteFieldProps {
  field: FiltersSelectField;
}

interface FilterCancelProps {
  handleClick: FilterActionHandlerType | undefined;
}

interface FilterEditProps {
  handleClick: FilterActionHandlerType | undefined;
}

interface FilterRemoveProps {
  handleClick: FilterActionHandlerType | undefined;
  newParams: NewFilterAndPaginationParams;
}

const FilterAction = ({ action, children, handleClick }: FilterActionProps) => {
  const hasAction = action !== undefined;
  const hasHandler = handleClick !== undefined;

  return hasAction && hasHandler ? (
    <span className='filter-link' onClick={event => handleClick(event, action)}>
      {children}
    </span>
  ) : (
    <span className='filter-link'>
      {children}
    </span>
  );
};

export const FilterLabel = ({ label }: FilterLabelProps) => (
  <strong>{label}</strong>
);

export const FilterText = ({ children }: FilterTextProps) => (
  <span>{children}</span>
);

const FilterCancel = ({ handleClick }: FilterCancelProps) => (
  <button
    className='filter-form-button filter-form-cancel'
    onClick={handleClick}
    type='button'
  >
    <Icon name='xmark' className='icon-action' />
  </button>
);

const FilterEdit = ({ handleClick }: FilterEditProps) => (
  <button
    className='filter-form-button filter-form-edit'
    onClick={handleClick}
    type='button'
  >
    <Icon name='pen' className='icon-action' />
  </button>
);

const FilterRemove = ({ handleClick, newParams }: FilterRemoveProps) => (
  <LinkToQueryParams
    className='filter-form-button filter-remove'
    onClick={handleClick}
    newParams={newParams}
    replace={false}
    title='Remove this association'
  >
    <Icon name='xmark' className='icon-action' />
  </LinkToQueryParams>
);

const FilterSubmit = () => (
  <button
    className='filter-form-button filter-form-submit'
    type='submit'
  >
    Submit
  </button>
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

const FilterDateField = ({ field }: FilterDateFieldProps) => {
  const [searchParams] = useSearchParams();

  let value;

  if (searchParams.has(field.name)) {
    value = searchParams.get(field.name) as string;
  }

  return (
    <input
      className='filter-form-field'
      defaultValue={value}
      id={field.name}
      name={field.name}
      type='date'
    />
  );
};

const FilterSearchField = ({ field }: FilterSearchFieldProps) => {
  const ref = useRef<RefInputElement>(null);
  const [searchParams] = useSearchParams();

  let value;

  if (searchParams.has(field.name)) {
    value = searchParams.get(field.name) as string;
  }

  useEffect(() => {
    if (ref.current) {
      ref.current?.focus();
    }
  }, []);

  return (
    <input
      className='filter-form-field'
      defaultValue={value}
      name={field.name}
      ref={ref}
      type='search'
    />
  );
};

const FilterSelectField = ({ field }: FilterSelecteFieldProps) => {
  const [searchParams] = useSearchParams();

  let value;

  if (searchParams.has(field.name)) {
    value = searchParams.get(field.name) as string;
  }

  return (
    <select
      className='filter-form-field'
      defaultValue={value}
      id={field.name}
      name={field.name}
    >
      {Object.entries(field.options).map(([key, value]) => (
        <option key={key} value={key}>{value}</option>
      ))}
    </select>
  );
};

const FilterLabelArray = ({
  handleActionClick,
  labels,
  model,
}: FilterLabelArrayProps) => labels.map((label, i) => (
  <Fragment key={i}>
    {label.type === FiltersLabelTypes.Id && <FilterModelId label={label} model={model} />}
    {label.type === FiltersLabelTypes.InputDate && <FilterDateField field={label} />}
    {label.type === FiltersLabelTypes.InputSearch && <FilterSearchField field={label} />}
    {label.type === FiltersLabelTypes.Label && <FilterLabel label={label.value} />}
    {label.type === FiltersLabelTypes.Link && (
      <FilterAction action={label.action} handleClick={handleActionClick}>
        {label.value}
      </FilterAction>
    )}
    {label.type === FiltersLabelTypes.Select && <FilterSelectField field={label} />}
    {label.type === FiltersLabelTypes.Text && <FilterText>{label.value}</FilterText>}
  </Fragment>
)).reduce((prev: ReactElement, curr: ReactElement): any => [prev, ' ', curr]);

const FilterForm = ({
  action,
  filter,
  handleActionClick,
  handleCancel,
  setIsEditable,
}: FilterFormProps) => {
  const hasFields = filter && 'fields' in filter && typeof filter.fields === 'object';
  const hasAction = hasFields && action && filter.fields && action in filter.fields;
  const fields = hasFields && hasAction && filter.fields ? filter?.fields[action] : undefined;

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const handleSubmit: SubmitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formParams = Object.fromEntries(formData.entries());
    const params = {
      ...formParams,
      page: null,
    } as NewFilterParams;
    const queryParams = getQueryParams(location, params, false);

    setSearchParams(queryParams.searchParams);
    setIsEditable(true);
  };

  return (
    <form className='filter-form' onSubmit={handleSubmit} id={filter?.id}>
      {fields !== undefined && (
        <fieldset className='filter-form-fieldset'>
          <FilterLabelArray
            handleActionClick={handleActionClick}
            labels={fields}
          />
        </fieldset>
      )}

      <div className='filter-form-actions'>
        <FilterSubmit />
        <FilterCancel handleClick={handleCancel} />
      </div>
    </form>
  );
};

const FilterLabels = ({
  filter,
  filterRelated,
  handleActionClick,
  handleEditClick,
  handleRemoveClick,
  isEditable,
}: FilterLabelsProps) => {
  const [searchParams] = useSearchParams();
  const hasOtherFilter = filterRelated !== undefined;

  const hasValues = filter && 'values' in filter && Boolean(filter.values);
  const isRemovable = hasValues && !isEmpty(filter.values);
  const newParamsBase = {
    page: null,
  } as NewFilterAndPaginationParams;
  let newParams: NewFilterAndPaginationParams = newParamsBase;

  if (hasValues) {
    const keys = Object.keys(filter.values) as FiltersValuesKeys[];
    const otherKeys = Object.keys(filterRelated?.values ?? {}) as FiltersValuesKeys[];
    const emptyKeyArray: FiltersValuesKeys[] = [];
    const allKeys = emptyKeyArray.concat(keys as FiltersValuesKeys[], otherKeys as FiltersValuesKeys[]);

    newParams = allKeys.reduce((all, key: FiltersValuesKeys) => {
      const keyValues = searchParams.get(key);
      const filterKeyValues: FiltersValuesKeys = filter.values[key];
      let newValue = null;

      if (keyValues && Array.isArray(filterKeyValues)) {
        const values = filterKeyValues as FiltersValuesKeys[];

        newValue = keyValues.split(',').filter((v: FilterStringValue) => !values.includes(v as FiltersValuesKeys)).join(',');
      }

      return {
        ...all,
        [key]: newValue,
      };
    }, newParamsBase);
  }

  if (!filter) return null;

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
      {(isEditable || isRemovable) && (
        <>
          <div className='filter-form-actions'>
            {isEditable && (
              <FilterEdit handleClick={handleEditClick} />
            )}
            {isRemovable && (
              <FilterRemove
                handleClick={handleRemoveClick}
                newParams={newParams}
              />
            )}
          </div>
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
  const [searchParams] = useSearchParams();

  const hasFilter = filter !== undefined;
  const hasFields = hasFilter && 'fields' in filter && filter.fields !== null;
  const hasValues = hasFilter && 'values' in filter;

  const [activeAction, setActiveAction] = useState<FiltersActionValue | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(hasValues);

  const hasActiveAction = Boolean(activeAction);

  const handleActionClick: FilterActionHandlerType = (event, action) => {
    if (action) {
      setActiveAction(action);
      setIsEditable(false);
    }
  };

  const handleCancelClick: FilterActionHandlerType = () => {
    setActiveAction(null);
    setIsEditable(true);
  };

  const handleEditClick: FilterActionHandlerType = () => {
    setIsEditable(false);
  };

  const handleRemoveClick: FilterActionHandlerType = () => {
    setActiveAction(null);
    setIsEditable(false);
  };

  const Tag = inline ? 'span' : 'div';

  useEffect(() => {
    if (hasFields && isEditable && !activeAction) {
      const initialActions: FiltersActionValue[] = [];
      const fields = filter.fields as Record<FiltersActionValue, FiltersLabel[]> | FiltersLabel[];

      const actions = Object.entries(fields).reduce((selectedActions, [key, value]) => {
        const params: (keyof FiltersValues)[] = value
          .filter((obj: FiltersLabel) => 'name' in obj)
          .map((obj: FiltersLabelWithName) => obj.name);

        if (params.some(param => searchParams.has(param))) {
          selectedActions.push(key as FiltersActionValue);
        }

        return selectedActions;
      }, initialActions);

      if (actions.length) {
        setActiveAction(actions[0]);
      }
    }
  }, [activeAction, filter, hasFields, isEditable, searchParams, setActiveAction]);

  if (!hasFilter && !children) return null;

  return (
    <Tag className={cx('filter', !isEditable && 'filter-option')}>
      {hasActiveAction && !isEditable && hasFields ? (
        <FilterForm
          filter={filter}
          action={activeAction}
          handleCancel={handleCancelClick}
          handleActionClick={handleActionClick}
          setIsEditable={setIsEditable}
        />
      ) : (
        <FilterLabels
          filter={filter}
          filterRelated={filterRelated}
          handleActionClick={handleActionClick}
          handleEditClick={handleEditClick}
          handleRemoveClick={handleRemoveClick}
          isEditable={isEditable && hasActiveAction}
        />
      )}
      {children && (
        <>
          {hasFilter && ' '}
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
