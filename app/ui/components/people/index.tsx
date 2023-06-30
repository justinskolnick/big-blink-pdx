import React from 'react';
import { useSelector } from 'react-redux';

import { percentage } from '../../lib/number';
import { RootState } from '../../lib/store';

import ItemTextWithIcon from '../item-text-with-icon';
import {
  getSortByParam,
  LinkToPerson,
  SortLink,
} from '../links';
import PersonIcon from './icon';
import SectionIndex from '../section-index';

import { selectors } from '../../reducers/people';
import {
  getPeoplePageIds,
  getPeoplePagination,
  getIncidentTotal
} from '../../selectors';

import { SortByValue } from '../../types';

interface PersonItemProps {
  id: number;
}

export const PersonItem = ({ id }: PersonItemProps) => {
  const person = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasTotal = Boolean(person?.incidents?.total);
  const incidentTotal = useSelector(getIncidentTotal);

  if (!person) return null;

  // todo: move percent into the response

  return (
    <tr>
      <td className='cell-type'><PersonIcon person={person} /></td>
      <td className='cell-name'>
        {hasTotal ? (
          <LinkToPerson id={person.id}>{person.name}</LinkToPerson>
        ) : (
          person.name
        )}
      </td>
      {hasTotal ? (
        <>
          <td className='cell-total'>{person.incidents.total}</td>
          <td className='cell-percent'>{percentage(person.incidents.total, incidentTotal)}%</td>
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
              <SortLink newParams={getSortByParam(SortByValue.Name)} title='Sort this list by name'>
                <ItemTextWithIcon icon='arrow-up' after>
                  Name
                </ItemTextWithIcon>
              </SortLink>
            </th>
            <th className='cell-total'>
              <SortLink newParams={getSortByParam(SortByValue.Total)} title='Sort this list by total'>
                <ItemTextWithIcon icon='arrow-down' after>
                  Total
                </ItemTextWithIcon>
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
