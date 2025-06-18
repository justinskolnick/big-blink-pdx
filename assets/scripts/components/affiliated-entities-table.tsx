import React, { useRef } from 'react';

import EntityIcon from './entities/icon';
import EntityItemLink from './entities/item-link';
import Icon from './icon';
import ItemTable from './item-table';
import {
  getWithEntityParams,
  FilterLink,
} from './links';
import PersonIcon from './people/icon';
import StatBox from './stat-box';

import type { AffiliatedEntityValue, Person } from '../types';

interface Props {
  entities: AffiliatedEntityValue;
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
  const ref = useRef<HTMLDivElement>(null);

  const hasPerson = Boolean(person);

  return (
    <StatBox title={title}>
      <div className='affiliated-items' ref={ref}>
        <ItemTable hasAnotherIcon={hasPerson && hasLobbyist}>
          {entities.records.map((item, i) => {
            const hasTotal = Boolean(item.total);

            return (
              <tr key={i}>
                <td className='cell-type'>
                  {item.entity.isRegistered ? (
                    <div
                      className='icons'
                      title={`${item.entity.name} is or was registered to lobby the City`}
                    >
                      <EntityIcon />
                      <RegisteredIcon />
                    </div>
                  ) : (
                    <EntityIcon />
                  )}
                </td>
                {hasPerson && hasLobbyist && (
                  <td className='cell-type'>
                    {item.isRegistered ? (
                      <div
                        className='icons'
                        title={`${person.name} is or was registered to lobby the City on behalf of ${item.entity.name}`}
                      >
                        <PersonIcon />
                        <RegisteredIcon />
                      </div>
                    ) : (
                      <PersonIcon />
                    )}
                  </td>
                )}
                <td className='cell-name'>
                  <EntityItemLink item={item.entity} className='item-entity'>
                    {item.entity.name}
                  </EntityItemLink>
                  <div className='item-description'>
                    {item.registrations}
                  </div>
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
