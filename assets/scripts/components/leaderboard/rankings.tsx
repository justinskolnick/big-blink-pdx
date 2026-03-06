import React, { MouseEvent } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import { FnSetLimit } from '../../hooks/use-limited-query';

import { BetterLink as Link } from '../links';
import { EntityItem } from '../entities/index';
import ItemSubhead from '../item-subhead';
import ItemSubsection from '../item-subsection';
import ItemTable, {
  ItemTableMore,
  ItemTableMoreOptions,
} from '../item-table';
import ItemTextWithIcon from '../item-text-with-icon';
import LeaderboardSubsection from './subsection';
import LeaderboardSubsectionGroup from './subsection-group';
import { PersonItem } from '../people/index';
import SubsectionSubhead from '../subsection-subhead';

import { getLeaderboardLabels } from '../../selectors';

import { Sections } from '../../types';
import type { LeaderboardSet } from '../../types';

interface LimitLinkProps {
  currentLimit: number;
  link: LeaderboardSet['links']['limit'];
  setLimit: FnSetLimit;
}

interface RankingsLinksProps {
  currentLimit: number;
  links: LeaderboardSet['links'];
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

const LimitLink = ({
  currentLimit,
  link,
  setLimit,
}: LimitLinkProps) => {
  const location = useLocation();
  const href = location.pathname;

  const hasMoreToShow = link.params.limit > currentLimit;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setLimit(link.params.limit);
  };

  return (
    <ItemTextWithIcon icon={hasMoreToShow ? 'plus' : 'minus'}>
      <a href={href} onClick={handleClick}>
        {link.label}
      </a>
    </ItemTextWithIcon>
  );
};

const RankingsLinks = ({
  currentLimit,
  links,
  setLimit
}: RankingsLinksProps) => (
  <ItemTableMore>
    <ItemTableMoreOptions>
      <LimitLink
        link={links.limit}
        currentLimit={currentLimit}
        setLimit={setLimit}
      />
      <ItemTextWithIcon icon='link'>
        <Link to={links.more.path}>
          {links.more.label}
        </Link>
      </ItemTextWithIcon>
    </ItemTableMoreOptions>
  </ItemTableMore>
);

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

          <RankingsLinks
            currentLimit={ids.length}
            links={rankingsLinks}
            setLimit={setLimit}
          />
        </ItemSubsection>
      </LeaderboardSubsectionGroup>
    </LeaderboardSubsection>
  );
};

export default Rankings;
