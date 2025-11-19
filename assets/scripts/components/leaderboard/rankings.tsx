import React, { MouseEvent } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import { FnSetLimit } from '../../hooks/use-limited-query';

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

import { getLeaderboardLabels } from '../../selectors';

import { Sections } from '../../types';
import type { LeaderboardSet } from '../../types';

interface LimitLinkProps {
  currentLimit: number;
  labels: LeaderboardSet['labels'];
  limit: number;
  setLimit: FnSetLimit;
}

interface Props {
  isGrid?: boolean;
  rankings: LeaderboardSet;
  section: Sections;
  setLimit: FnSetLimit;
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

const LimitLink = ({
  currentLimit,
  labels,
  limit,
  setLimit,
}: LimitLinkProps) => {
  const location = useLocation();
  const href = `${location.pathname}${location.search}`;

  const hasMoreToShow = limit > currentLimit;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setLimit(labels.links.limit.value);
  };

  return (
    <ItemTextWithIcon icon={hasMoreToShow ? 'plus' : 'minus'}>
      <a href={href} onClick={handleClick}>
        {labels.links.limit.label}
      </a>
    </ItemTextWithIcon>
  );
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

  const hasIds = ids?.length > 0;
  const hasLabels = Boolean(labels);

  const Item = useGetItem(section);
  const ItemsLink = useGetItemsLink(section);

  if (!hasIds || !hasLabels) return null;

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

          <LeaderboardMore>
            <LimitLink
              currentLimit={ids.length}
              labels={rankingsLabels}
              limit={10}
              setLimit={setLimit}
            />
            <ItemTextWithIcon icon='link'>
              <ItemsLink>
                {rankingsLabels.links.more}
              </ItemsLink>
            </ItemTextWithIcon>
          </LeaderboardMore>
        </ItemSubsection>
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default Rankings;
