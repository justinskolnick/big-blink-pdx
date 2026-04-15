import React from 'react';

import { type FnSetLimit } from '../../hooks/use-limited-query';
import useSelector from '../../hooks/use-app-selector';

import { EntityItem } from '../entities/index';
import ItemSubhead from '../item-subhead';
import ItemSubsection from '../item-subsection';
import ItemTable from '../item-table';
import { TableMoreLinks } from '../affiliated-item-table';
import LeaderboardSubsection from './subsection';
import LeaderboardSubsectionGroup from './subsection-group';
import { PersonItem } from '../people/index';
import SubsectionSubhead from '../subsection-subhead';

import { getLeaderboardLabels } from '../../selectors';

import { Sections } from '../../types';
import type { LeaderboardSet } from '../../types';

interface Props {
  isGrid?: boolean;
  rankings: LeaderboardSet;
  section: Sections;
  setLimit: FnSetLimit;
}

const useGetItem = (section: string): typeof EntityItem | typeof PersonItem | null => {
  if (section === Sections.Entities) {
    return EntityItem;
  } else if (section === Sections.People) {
    return PersonItem;
  }

  return null;
};

const Rankings = ({
  isGrid = false,
  rankings,
  section,
  setLimit,
}: Props) => {
  const labels = useSelector(getLeaderboardLabels);
  const hasPeriod = Boolean(labels?.period);

  const ids = rankings?.ids;
  const rankingsLabels = rankings?.labels;
  const rankingsLinks = rankings?.links;

  const hasIds = ids?.length > 0;
  const hasLabels = Boolean(labels);

  const Item = useGetItem(section);

  if (!hasIds || !hasLabels || !Item) return null;

  return (
    <LeaderboardSubsection isGrid={isGrid}>
      <SubsectionSubhead title={rankingsLabels.title}>
        {rankingsLabels.subtitle}
      </SubsectionSubhead>

      <LeaderboardSubsectionGroup>
        <ItemSubhead subtitle={rankingsLabels.table.title}>
          {hasPeriod && <h6>{labels.period}</h6>}
        </ItemSubhead>

        <ItemSubsection>
          <ItemTable hasPercent labels={rankingsLabels.table}>
            {ids.map(id => (
              <Item key={id} id={id} />
            ))}
          </ItemTable>

          <TableMoreLinks
            currentCount={ids.length}
            links={rankingsLinks}
            setLimit={setLimit}
          />
        </ItemSubsection>
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default Rankings;
