import React from 'react';
import { useSelector } from 'react-redux';

import { getPeopleLeaderboard } from '../../selectors';

import ItemSubhead from '../item-subhead';
import ItemTable from '../item-table';
import ItemTextWithIcon from '../item-text-with-icon';
import LeaderboardMore from '../leaderboard/more';
import LeaderboardSubsection from '../leaderboard/subsection';
import LeaderboardSubsectionGroup from '../leaderboard/subsection-group';
import { LinkToPeople } from '../links';
import { PersonItem } from '../people/index';
import SubsectionSubhead from '../subsection-subhead';

const OfficialsLeaderboard = () => {
  const result = useSelector(getPeopleLeaderboard);
  const officials = result?.officials;
  const label = officials?.label ?? '';
  const ids = officials?.ids ?? [];
  const hasIds = ids.length > 0;

  if (!hasIds) return null;

  return (
    <LeaderboardSubsection>
      <SubsectionSubhead title='City Officials'>
        These Portland City officials are ranked by total number of lobbying incident appearances.
      </SubsectionSubhead>

      <LeaderboardSubsectionGroup>
        <ItemSubhead subtitle={(
          <ItemTextWithIcon icon='trophy'>
            {label}:
          </ItemTextWithIcon>
        )} />
        <ItemTable hasPercent>
          {ids.map(id => (
            <PersonItem key={id} id={id} />
          ))}
        </ItemTable>

        <LeaderboardMore>
          <ItemTextWithIcon icon='link'>
            <LinkToPeople>
              View all officials in the full list of people
            </LinkToPeople>
          </ItemTextWithIcon>
        </LeaderboardMore>
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default OfficialsLeaderboard;
