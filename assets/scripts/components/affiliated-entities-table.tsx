import React, { useRef } from 'react';

import EntityIcon from './entities/icon';
import Icon from './icon';
import ItemTable from './item-table';
import {
  getWithEntityParams,
  FilterLink,
  LinkToEntity,
} from './links';
import PersonIcon from './people/icon';
import StatBox from './stat-box';

import type { AffiliatedItem, Person } from '../types';

interface Props {
  entities: AffiliatedItem[];
  hasLobbyist?: boolean;
  person?: Person;
  title?: string;
}

const RegisteredIcon = () => <Icon name='check' className='icon-registered' />;

const AffiliatedEntitiesTable = ({
  entities,
  hasLobbyist,
  person,
  title,
}: Props) => {
  const ref = useRef<HTMLDivElement>();

  const hasPerson = Boolean(person);

  return (
    <StatBox title={title}>
      <div className='affiliated-items' ref={ref}>
        <ItemTable hasAnotherIcon={hasPerson && hasLobbyist}>
          {entities.map((item, i) => {
            const hasTotal = Boolean(item.total);

            return (
              <tr key={i}>
                {hasPerson ? (
                  hasLobbyist ? (
                    <>
                      <td className='cell-type'>
                        <EntityIcon />
                      </td>
                      <td className='cell-type'>
                        {item.isRegistered ? (
                          <div
                            className='icons'
                            title={`${person.name} is or was registered to lobby on behalf of ${item.entity.name}`}
                          >
                            <PersonIcon />
                            <RegisteredIcon />
                          </div>
                        ) : (
                          <PersonIcon />
                        )}
                      </td>
                    </>
                  ) : (
                    <td className='cell-type'>
                      <EntityIcon />
                    </td>
                  )
                ) : (
                  <td className='cell-type'>
                    <EntityIcon />
                  </td>
                )}
                <td className='cell-name'>
                  <LinkToEntity id={item.entity.id} className='item-entity'>
                    {item.entity.name}
                  </LinkToEntity>
                </td>
                <td className='cell-total'>
                  {hasTotal ? (
                    <FilterLink newParams={getWithEntityParams(item)} hasIcon>
                      {item.total}
                    </FilterLink>
                  ) : '-'}
                </td>
              </tr>
            );
          })}
        </ItemTable>
      </div>
    </StatBox>
  );
};

export default AffiliatedEntitiesTable;
