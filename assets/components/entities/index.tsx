import React from 'react';
import { useSelector } from 'react-redux';

import { percentage } from '../../lib/number';
import { RootState } from '../../lib/store';

import EntityIcon from './icon';
import {
  getSortByParam,
  LinkToEntity,
  SortLink,
} from '../links';
import SectionIndex from '../section-index';

import { selectors } from '../../reducers/entities';

import {
  getEntitiesPageIds,
  getEntitiesPagination,
  getIncidentTotal
} from '../../selectors';

import { SortByValues, SortValues } from '../../types';

interface ItemProps {
  id: number;
}

export const EntityItem = ({ id }: ItemProps) => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasTotal = Boolean(entity.incidents?.total);
  const incidentTotal = useSelector(getIncidentTotal);

  if (!entity) return null;

  // todo: move percent into the response

  return (
    <tr>
      <td className='cell-type'><EntityIcon /></td>
      <td className='cell-name'>
        {hasTotal ? (
          <LinkToEntity id={entity.id}>{entity.name}</LinkToEntity>
        ) : (
          entity.name
        )}
      </td>
      {hasTotal ? (
        <>
          <td className='cell-total'>{entity.incidents.total}</td>
          <td className='cell-percent'>{percentage(entity.incidents.total, incidentTotal)}%</td>
        </>
      ) : (
        <>
          <td className='cell-total'>-</td>
          <td className='cell-percent'>-</td>
        </>
      )}
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
                newParams={getSortByParam(SortByValues.Name, true)}
                defaultSort={SortValues.ASC}
                title='Sort this list by name'
              >
                Name
              </SortLink>
            </th>
            <th className='cell-total'>
              <SortLink
                newParams={getSortByParam(SortByValues.Total)}
                defaultSort={SortValues.DESC}
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
