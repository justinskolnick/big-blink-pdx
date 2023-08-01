import React, { useRef, useState, Fragment, ReactElement } from 'react';
import { cx, css } from '@emotion/css';

import EntityIcon from './entities/icon';
import ItemTable from './item-table';
import ItemTableRow from './item-table-row';
import PersonIcon from './people/icon';

import type { AffiliatedItem } from '../types';

interface Props {
  affiliatedItems: AffiliatedItem[];
  TitleCell: (ctx: { item: AffiliatedItem }) => ReactElement;
  TotalCell?: (ctx: { item: AffiliatedItem }) => ReactElement;
  label: string;
}

const styles = css`
  &.no-results {
    padding-bottom: 6px;
    padding-top: 6px;
    color: var(--color-text-lighter);
    font-size: 16px;
  }

  table {
    tbody {
      tr {
        &:nth-of-type(-n + 5) {
          .cell-name {
            font-size: 16px;
          }
        }

        .cell-name {
          font-weight: 400;
        }
      }
    }

    td {
      &.cell-total {
        font-weight: 600;
        font-size: 10px;

        a {
          color: var(--color-text-lighter);

          .icon {
            color: inherit;
          }

          &:hover {
            border-bottom: none;
            color: var(--color-link);
          }
        }

        .item-text-with-icon {
          align-items: center;

          .icon {
            margin-right: 1ch;
            font-size: 10px;
          }
        }
      }
    }
  }

  .button-toggle {
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding: 9px 18px;
    width: 100%;
    border: none;
    border-radius: 9px;
    background-color: var(--color-accent-lightest);
    box-shadow: 0 1px 2px var(--color-accent-alt-lighter);
    color: var(--color-link);
    font-weight: 600;
    font-size: 12px;
    text-align: center;
    transition: box-shadow 250ms ease,
                transform 250ms ease;

    &:hover {
      transform: scale(1.05);
      transition-timing-function: cubic-bezier(0.32, 2, 0.55, 0.27);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  table + .button-toggle {
    margin-top: 1rem;
  }

  a {
    color: var(--color-link);
  }
`;

const AffiliatedItemTable = ({
  affiliatedItems,
  TitleCell,
  TotalCell,
  label,
}: Props) => {
  const ref = useRef<HTMLDivElement>();
  const [showAll, setShowAll] = useState(false);
  const initialCount = 5;
  const items = showAll ? affiliatedItems : affiliatedItems.slice(0, initialCount);
  const hasMoreToShow = affiliatedItems.length > initialCount;
  const hasItems = affiliatedItems.length > 0;

  const scrollToRef = () => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return hasItems ? (
    <div className={styles} ref={ref}>
      <ItemTable>
        {items.map((item, i) => (
          <ItemTableRow
            key={i}
            name={<TitleCell item={item} />}
            hasTotal={Boolean(item.total)}
            total={TotalCell ? <TotalCell item={item} /> : item.total}
            type={('person' in item) ? (
              <PersonIcon person={item.person} />
            ) : (
              <EntityIcon />
            )}
          />
        ))}
      </ItemTable>

      {hasMoreToShow && (
        <button type='button' className='button-toggle' onClick={e => {
          e.preventDefault();
          scrollToRef();
          setShowAll(!showAll);
        }}>
          {showAll ? (
            <>View top {initialCount} {label}</>
          ) : (
            <>View all {affiliatedItems.length} {label}</>
          )}
        </button>
      )}
    </div>
  ) : (
    <div className={cx(styles, 'no-results')}>None found</div>
  );
};

export default AffiliatedItemTable;
