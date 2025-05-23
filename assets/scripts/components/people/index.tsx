import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';

import Icon from './icon';
import ItemLink from './item-link';
import SectionIndex from '../section-index';
import { SortLink } from '../links';

import { selectors } from '../../reducers/people';
import {
  getPeoplePageIds,
  getPeoplePagination,
} from '../../selectors';

import { SortByValues, SortValues } from '../../types';

interface PersonItemProps {
  id: number;
}

export const PersonItem = ({ id }: PersonItemProps) => {
  const person = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasTotal = Boolean(person?.overview?.totals?.values.total.value);

  if (!person) return null;

  return (
    <tr>
      <td className='cell-type'><Icon person={person} /></td>
      <td className='cell-name'>
        {hasTotal ? (
          <ItemLink item={person}>{person.name}</ItemLink>
        ) : (
          person.name
        )}
      </td>
      <td className='cell-total'>{person.overview?.totals.values.total.value ?? '-'}</td>
      <td className='cell-percent'>{person.overview?.totals.values.percentage.value ?? '-'}</td>
    </tr>
  );
};

const Introduction = () => (
  <>
    <p>
      The names listed below include City officials and lobbyists whose names appear in lobbying activity reports published by the City of Portland. City Code (<a href='https://www.portland.gov/code/2/12/020'>2.12.020</a>) defines a “City official” as:
    </p>
    <blockquote>
      <p>any City elected official; the at will staff of a City elected official; any City director as defined in this section; or appointee to the Portland Development Commission, the Planning Commission, the Design Commission, and the Fire and Police Disability and Retirement Board.</p>
    </blockquote>
    <p>
       and a “Lobbyist” as:
    </p>
    <blockquote>
      <p>any individual who is authorized to lobby on behalf of a lobbying entity.</p>
    </blockquote>
  </>
);

const Index = () => {
  const pagination = useSelector(getPeoplePagination);
  const pageIds = useSelector(getPeoplePageIds);
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
            <PersonItem key={id} id={id} />
          ))}
        </tbody>
      </table>
    </SectionIndex>
  );
};

export default Index;
