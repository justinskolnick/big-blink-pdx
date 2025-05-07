import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import { RootState } from '../lib/store';

import Eyes from './eyes';
import {
  BetterLink as Link,
  GlobalLink,
  LinkToEntities,
  LinkToIncidents,
  LinkToPeople,
  LinkToSources,
} from './links';
import SectionIcon from './section-icon';

import { getSection } from '../selectors';
import { selectors as entitiesSelectors } from '../reducers/entities';
import { selectors as incidentsSelectors } from '../reducers/incidents';
import { selectors as peopleSelectors } from '../reducers/people';
import { selectors as sourcesSelectors } from '../reducers/sources';

import { Sections } from '../types';
import type { SectionType } from '../types';

interface Props {
  children?: ReactNode;
  icon?: IconName;
  title?: ReactNode | string;
}

interface ItemLinkProps {
  children: ReactNode;
  section: SectionType;
}

const getItemSelectors = (section?: SectionType) => {
  let selectors = null;

  if (section?.slug === Sections.Entities) {
    selectors = entitiesSelectors;
  } else if (section?.slug === Sections.Incidents) {
    selectors = incidentsSelectors;
  } else if (section?.slug === Sections.People) {
    selectors = peopleSelectors;
  } else if (section?.slug === Sections.Sources) {
    selectors = sourcesSelectors;
  }

  return selectors;
};

const useGetSectionLink = (slug: string) => {
  if (slug === Sections.Entities) {
    return LinkToEntities;
  } else if (slug === Sections.Incidents) {
    return LinkToIncidents;
  } else if (slug === Sections.People) {
    return LinkToPeople;
  } else if (slug === Sections.Sources) {
    return LinkToSources;
  }
};

const SectionItemLink = ({ children, section }: ItemLinkProps) => {
  const selectors = getItemSelectors(section);
  const item = useSelector((state: RootState) => selectors?.selectById(state, section.id));

  return <Link to={item.links.self}>{children}</Link>;
};

const Header = ({
  children,
  icon,
  title,
}: Props) => {
  const section = useSelector(getSection);

  const slug = section?.slug;

  const SectionLink = useGetSectionLink(slug);

  const hasLink = Boolean(SectionLink);
  const hasSubhead = Boolean(section.subtitle);
  const hasDetails = section.details?.length > 0;

  return (
    <header
      className={cx(
        'header',
        hasSubhead && 'has-subheader'
      )}
    >
      <div className='header-overview'>
        <div className='header-identity'>
          <h1>
            <GlobalLink to='/' className='header-identity-link'>
              <span className='text-secondary'>The</span>
              {' '}
              <span className='text-primary'>Big Blink</span>
              {' '}
              <span className='text-secondary'>PDX</span>
            </GlobalLink>
          </h1>

          <div className='header-identity-eyes'>
            <Eyes />
          </div>
        </div>

        <div className='header-section'>
          <div className={cx('header-section-icon', hasLink && 'has-link')}>
            {hasLink ? (
              <SectionLink aria-label='section-icon'>
                <SectionIcon name={icon} slug={slug} />
              </SectionLink>
            ) : (
              <SectionIcon name={icon} slug={slug} />
            )}
          </div>

          <div className='header-section-title'>
            <h2>{hasLink ? (
              <SectionLink aria-label='section-title'>{title ?? section.title}</SectionLink>
            ) : (
              title ?? section.title
            )}</h2>
            {hasSubhead && (
              <>
                <h3>
                  <SectionItemLink section={section}>{section.subtitle}</SectionItemLink>
                </h3>
                {hasDetails && (
                  <h4>
                    {section.details.map((detail, i) => (
                      <span key={i} className='header-section-detail'>{detail}</span>
                    ))}</h4>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {children}
    </header>
  );
};

export default Header;
