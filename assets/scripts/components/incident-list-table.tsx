import React, { useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { cx } from '@emotion/css';

import { RootState } from '../lib/store';

import Icon from './icon';
import IncidentModal from './incident-modal';
import {
  getSortByParam,
  LinkToIncident,
  SortLink,
} from './links';

import { selectors } from '../reducers/incidents';

import { SortByValues, SortValues } from '../types';
import type { Id, Ids } from '../types';

interface IncidentRowProps {
  id: Id;
}

interface IncidentListTableProps {
  hasSort?: boolean;
  ids: Ids;
}

const IncidentRow = ({ id }: IncidentRowProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const incident = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasNotes = Boolean(incident?.notes);

  const deactivate = () => setIsSelected(false);
  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target instanceof HTMLElement) {
      if (event.target.closest('.incident-list-item')) {
        setIsSelected(!isSelected);
      }
    }
  };

  if (!incident) return null;

  return (
    <>
      <tr
        className={cx('incident-list-item is-selectable', isSelected && 'is-selected')}
        onClick={handleClick}
      >
        <td className='cell-date'>
          {hasNotes ? (
            <span className='has-notes'>
              {incident.contactDate}
              <Icon name='asterisk' />
            </span>
          ) : incident.contactDate}
        </td>
        <td className='cell-entity'>{incident.entity}</td>
        <td className='cell-topic'>{incident.topic}</td>
        <td className='cell-link'>
          <LinkToIncident id={incident.id} aria-label='View'>
            <Icon name='chevron-right' />
          </LinkToIncident>
          <IncidentModal
            deactivate={deactivate}
            id={incident.id}
            isActive={isSelected}
          />
        </td>
      </tr>
    </>
  );
};

const IncidentListTable = ({ hasSort, ids }: IncidentListTableProps) => {
  const hasIds = ids?.length > 0;

  if (!ids) return null;

  return (
    <div className='incident-list-table-frame'>
      <div className='incident-list-table'>
        <table cellPadding='0' cellSpacing='0'>
          <thead>
            <tr>
              <th className='cell-date'>
                {hasSort ? (
                  <SortLink
                    newParams={getSortByParam(SortByValues.Date, true)}
                    defaultSort={SortValues.ASC}
                    title='Sort this list by date'
                  >
                    Date
                  </SortLink>
                ) : 'Date'}
              </th>
              <th className='cell-entity'>Entity</th>
              <th className='cell-topic'>Topic</th>
              <th className='cell-link'></th>
            </tr>
          </thead>
          <tbody>
            {hasIds ? ids.map(id => (
              <IncidentRow key={id} id={id} />
            )) : (
              <tr className='incident-list-item'>
                <td colSpan={4}>No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentListTable;
