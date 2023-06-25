import React from 'react';
import { useSelector } from 'react-redux';

import { getEntitiesLeaderboard } from '../../selectors';

import { EntityItem } from '../entities/index';
import ItemSubhead from '../item-subhead';
import ItemTable from '../item-table';
import ItemTextWithIcon from '../item-text-with-icon';
import LeaderboardMore from '../leaderboard/more';
import LeaderboardSubsection from '../leaderboard/subsection';
import LeaderboardSubsectionGroup from '../leaderboard/subsection-group';
import { LinkToEntities } from '../links';
import SubsectionSubhead from '../subsection-subhead';

const EntitiesLeaderboard = () => {
  const result = useSelector(getEntitiesLeaderboard);
  const ids = result?.all ?? [];
  const hasIds = ids.length > 0;

  if (!hasIds) return null;

  return (
    <LeaderboardSubsection>
      <SubsectionSubhead title='Lobbying Entities'>
        These lobbying entities are ranked by total number of lobbying incident appearances.
      </SubsectionSubhead>

      <LeaderboardSubsectionGroup>
        <ItemSubhead subtitle={(
          <ItemTextWithIcon icon='building'>
            Portland’s most active lobbying entities:
          </ItemTextWithIcon>
        )} />
        <ItemTable hasPercent>
          {ids.map(id => (
            <EntityItem key={id} id={id} />
          ))}
        </ItemTable>

        <LeaderboardMore>
          <ItemTextWithIcon icon='link'>
            <LinkToEntities>
              View the full list of lobbying entities
            </LinkToEntities>
          </ItemTextWithIcon>
        </LeaderboardMore>
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default EntitiesLeaderboard;
