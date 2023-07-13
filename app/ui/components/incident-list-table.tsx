import React, { useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { cx, css } from '@emotion/css';

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

const styles = css`
  position: relative;
  padding: 9px;
  border: 2px solid var(--color-table-divider);
  border-radius: 9px;
  background-color: var(--color-table-frame-background);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    --mask:
      radial-gradient(11.5px at 50% calc(100% + 5.40px),#0000 calc(99% - 2px),#000 calc(101% - 2px) 99%,#0000 101%) calc(50% - 18px) calc(50% - 5.5px + .5px)/36px 11px ,
      radial-gradient(11.5px at 50% -5.4px,#0000 calc(99% - 2px),#000 calc(101% - 2px) 99%,#0000 101%) 50% calc(50% + 5.5px)/36px 11px ;
    -webkit-mask: var(--mask);
            mask: var(--mask);
    background-color: var(--color-table-header-background);
    z-index: 1;
  }

  .incident-list-table {
    border: 2px solid var(--color-table-divider);
    border-radius: 9px;
    overflow-x: auto;
  }


  table {
    position: relative;
    width: 100%;
    z-index: 2;
  }

  thead {
    tr {
      background-color: var(--color-table-header-background);
      color: var(--color-table-header-text);
    }

    th {
      color: var(--color-table-header-text);
    }
  }

  tbody {
    box-shadow: 0 -1px 6px var(--color-blue);
    background-color: var(--color-table-background);
  }

  th, td {
    padding: 9px;
    text-align: left;

    &:first-child {
      padding-left: 18px;
    }
  }

  td {
    padding: 9px;
  }

  .cell-date {
    white-space: nowrap;

    .has-notes {
      display: inline-flex;

      .icon {
        margin-left: 1ch;
        color: var(--color-accent-alt-lighter);
        font-size: 6px;
      }
    }
  }

  .cell-entity {
    min-width: 15ch;
    font-weight: 600;
  }

  .cell-link {
    padding: 0;
    font-weight: 600;
    vertical-align: middle;

    a {
      display: inline-block;
      padding: 9px;
      width: 18px;
      text-align: center;

      &:hover {
        border-bottom: none;
      }
    }
  }

  .link-sort {
    color: inherit;

    &:hover {
      border-bottom: none;

      .icon {
        color: var(--color-orange);
      }
    }

    &.is-active {
      border-bottom: none;
    }

    .icon {
      font-size: 9px;
    }
  }

  tr {
    &.incident-list-item {
      td {
        border-top: 1px solid var(--color-table-divider);
      }

      &.is-selectable {
        &:hover {
          td {
            cursor: pointer;
            background-color: var(--color-table-divider);
            color: var(--color-table-text-hover);
          }

          a {
            color: var(--color-table-text-hover);
          }
        }
      }
    }

    &.is-selected {
      cursor: pointer;
      background-color: var(--color-table-border);
      color: var(--color-white);
    }
  }

  .incident-list-item-detail {
    tr {
      th {
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: 0;
      }

      td {
        padding-top: 6px;
        padding-bottom: 6px;
      }
    }
  }

  @media screen and (max-width: 600px) {
    position: relative;

    table {
      position: relative;
      z-index: 2;
    }

    .cell-link {
      display: none;
    }
  }
`;

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
    <div className={cx('incident-list-table-frame', styles)}>
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
                <td colSpan={5}>No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentListTable;
