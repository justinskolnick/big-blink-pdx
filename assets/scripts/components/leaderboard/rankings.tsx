import React from 'react';

import { EntityItem } from '../entities/index';
import ItemSubhead from '../item-subhead';
import ItemSubsection from '../item-subsection';
import ItemTable from '../item-table';
import ItemTextWithIcon from '../item-text-with-icon';
import LeaderboardMore from './more';
import LeaderboardSubsection from './subsection';
import LeaderboardSubsectionGroup from './subsection-group';
import { LinkToEntities, LinkToPeople } from '../links';
import { PersonItem } from '../people/index';
import SubsectionSubhead from '../subsection-subhead';

import { Sections } from '../../types';
import type { LeaderboardSet } from '../../types';

interface Props {
  isGrid?: boolean;
  rankings: LeaderboardSet;
  section: Sections;
}

const useGetItem = (section: string) => {
  if (section === Sections.Entities) {
    return EntityItem;
  } else if (section === Sections.People) {
    return PersonItem;
  }
};

const useGetItemsLink = (section: string) => {
  if (section === Sections.Entities) {
    return LinkToEntities;
  } else if (section === Sections.People) {
    return LinkToPeople;
  }
};

const Rankings = ({
  isGrid = false,
  rankings,
  section,
}: Props) => {
  const ids = rankings?.ids;
  const labels = rankings?.labels;

  const hasIds = ids?.length > 0;
  const hasLabels = Boolean(labels);

  const Item = useGetItem(section);
  const ItemsLink = useGetItemsLink(section);

  if (!hasIds || !hasLabels) return null;

  return (
    <LeaderboardSubsection isGrid={isGrid}>
      <SubsectionSubhead title={labels.title}>
        {labels.subtitle}
      </SubsectionSubhead>

      <LeaderboardSubsectionGroup>
        <ItemSubhead subtitle={labels.table.title} />

        <ItemSubsection>
          <ItemTable hasPercent labels={labels.table}>
            {ids.map(id => (
              <Item key={id} id={id} />
            ))}
          </ItemTable>

          <LeaderboardMore>
            <ItemTextWithIcon icon='link'>
              <ItemsLink>
                {labels.links.more}
              </ItemsLink>
            </ItemTextWithIcon>
          </LeaderboardMore>
        </ItemSubsection>
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default Rankings;
