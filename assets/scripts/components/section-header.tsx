import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Eyes from './eyes';
import Header, { HeaderOverview } from './header';
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
import { useGetEntityById } from '../reducers/entities';
import { useGetIncidentById } from '../reducers/incidents';
import { useGetPersonById } from '../reducers/people';
import { useGetSourceById } from '../reducers/sources';

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

interface DescriptionProps {
  section: SectionType;
}

const getItemSelector = (section?: SectionType) => {
  let selector = null;

  if (section?.slug === Sections.Entities) {
    selector = useGetEntityById;
  } else if (section?.slug === Sections.Incidents) {
    selector = useGetIncidentById;
  } else if (section?.slug === Sections.People) {
    selector = useGetPersonById;
  } else if (section?.slug === Sections.Sources) {
    selector = useGetSourceById;
  }

  return selector;
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
  const selector = getItemSelector(section);
  const item = selector(section.id);

  return <Link to={item.links.self}>{children}</Link>;
};

const SectionDescription = ({ section }: DescriptionProps) => {
  const selector = getItemSelector(section);
  const item = selector(section.id);
  const details = item.details;

  const hasDetails = Object.keys(details || {}).length > 0;

  return (
    <h4>
      {hasDetails && Object.values(details).map((detail, i) => (
        <span key={i} className='header-section-detail'>{detail}</span>
      ))}
    </h4>
  );
};

const SectionHeader = ({
  children,
  icon,
  title,
}: Props) => {
  const section = useSelector(getSection);

  const slug = section?.slug;

  const SectionLink = useGetSectionLink(slug);

  const hasLink = Boolean(SectionLink);
  const hasSubhead = Boolean(section.subtitle);

  return (
    <Header className={hasSubhead && 'has-subheader'}>
      <HeaderOverview>
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
                <SectionDescription section={section} />
              </>
            )}
          </div>
        </div>
      </HeaderOverview>

      {children}
    </Header>
  );
};

export default SectionHeader;
