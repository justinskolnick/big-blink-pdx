import React from 'react';

import { type FnSetLimit } from '../../../hooks/use-limited-query';
import useSelector from '../../../hooks/use-app-selector';

import EntityItem from '../../entities/item';
import ItemSubhead from '../../item-subhead';
import ItemSubsection from '../../item-subsection';
import ItemTable from '../../item-table';
import PersonItem from '../../people/item';
import Subsection from '../../subsection';
import SubsectionContent from '../../subsection-content';
import SubsectionSubhead from '../../subsection-subhead';
import { TableMoreLinks } from '../../affiliated-item-table';

import { getLeaderboardLabels } from '../../../selectors';

import { Sections } from '../../../types';
import type { LeaderboardSet } from '../../../types';

interface Props {
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
    <Subsection>
      <SubsectionSubhead title={rankingsLabels.title}>
        {rankingsLabels.subtitle}
      </SubsectionSubhead>

      <SubsectionContent>
        <ItemSubhead
          subtitle={rankingsLabels.table.title}
          subsubtitle={hasPeriod && labels.period}
        />

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
      </SubsectionContent>
    </Subsection>
  );
};

export default Rankings;
