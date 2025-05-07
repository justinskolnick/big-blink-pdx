import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';

import EntityIcon from './icon';
import ItemLink from './item-link';
import { SortLink } from '../links';
import SectionIndex from '../section-index';

import { selectors } from '../../reducers/entities';

import {
  getEntitiesPageIds,
  getEntitiesPagination,
} from '../../selectors';

import { SortByValues, SortValues } from '../../types';

interface ItemProps {
  id: number;
}

export const EntityItem = ({ id }: ItemProps) => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasTotal = Boolean(entity?.overview?.totals?.values.total.value);

  if (!entity) return null;

  return (
    <tr>
      <td className='cell-type'><EntityIcon /></td>
      <td className='cell-name'>
        {hasTotal ? (
          <ItemLink item={entity}>{entity.name}</ItemLink>
        ) : (
          entity.name
        )}
      </td>
      <td className='cell-total'>{entity.overview?.totals.values.total.value ?? '-'}</td>
      <td className='cell-percent'>{entity.overview?.totals.values.percentage.value ?? '-'}</td>
    </tr>
  );
};

const Introduction = () => (
  <>
    <p>
      The entities listed below reported their lobbying activity to the City of Portland. City Code (<a href='https://www.portland.gov/code/2/12/020'>2.12.020</a>) defines a “Lobbying entity” as:
    </p>
    <blockquote>
      <p>any individual, business association, corporation, partnership, association, club, company, business trust, organization or other group who lobbies either by employing or otherwise authorizing a lobbyist to lobby on that person’s behalf.</p>
    </blockquote>
  </>
);

const Index = () => {
  const pagination = useSelector(getEntitiesPagination);
  const pageIds = useSelector(getEntitiesPageIds);
  const hasPageIds = pageIds?.length > 0;

  useFetchAndScrollOnRouteChange();

  return (
    <SectionIndex
      pagination={pagination}
      introduction={<Introduction />}
      isLoading={!hasPageIds}
    >
      <table className='section-index-list' cellPadding='0' cellSpacing='0'>
        <thead>
          <tr>
            <th className='cell-name' colSpan={2}>
              <SortLink
                defaultSort={SortValues.ASC}
                isDefault
                name={SortByValues.Name}
                title='Sort this list by name'
              >
                Name
              </SortLink>
            </th>
            <th className='cell-total'>
              <SortLink
                defaultSort={SortValues.DESC}
                name={SortByValues.Total}
                title='Sort this list by total'
              >
                Total
              </SortLink>
            </th>
            <th className='cell-percent'>%</th>
          </tr>
        </thead>
        <tbody>
          {pageIds.map((id) => (
            <EntityItem key={id} id={id} />
          ))}
        </tbody>
      </table>
    </SectionIndex>
  );
};

export default Index;
