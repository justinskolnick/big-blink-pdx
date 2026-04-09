import React, { ReactNode } from 'react';
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

import useSelector from '../hooks/use-app-selector';

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

interface SectionLinkProps {
  children: ReactNode;
  slug?: string;
}

interface ItemLinkProps {
  children: ReactNode;
  section?: SectionType;
}

interface SectionDescriptionLinkProps {
  section?: SectionType;
}

interface DescriptionProps {
  section?: SectionType;
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

const getHasLink = (slug?: string) =>
  slug && Object.values(Sections).includes(slug as Sections);

const SectionLink = ({ children, slug, ...rest }: SectionLinkProps) => {
  if (!slug) return null;

  let Component = null;

  if (slug === Sections.Entities) {
    Component = LinkToEntities;
  } else if (slug === Sections.Incidents) {
    Component = LinkToIncidents;
  } else if (slug === Sections.People) {
    Component = LinkToPeople;
  } else if (slug === Sections.Sources) {
    Component = LinkToSources;
  }

  if (!Component) return null;

  return (
    <Component {...rest}>{children}</Component>
  );
};

interface WhenSectionProps {
  children: (section?: SectionType) => ReactNode;
  section?: SectionType;
}

const WhenSection = ({ children, section }: WhenSectionProps) => {
  return section ? children(section) : null;
};

const SectionDescriptionLink = ({ section }: SectionDescriptionLinkProps) => {
  return (
    <h3>
      <WhenSection section={section}>
        {item => (
          <SectionItemLink section={item}>
            {item?.subtitle}
          </SectionItemLink>
        )}
      </WhenSection>
    </h3>
  );
};

const SectionItemLink = ({ children, section }: ItemLinkProps) => {
  let selector;
  let item;

  if (section) {
    selector = getItemSelector(section);

    if (selector) {
      item = selector(section.id);
    }
  }

  if (!item) return null;

  return <Link to={item.links.self}>{children}</Link>;
};

const SectionDescription = ({ section }: DescriptionProps) => {
  let selector;
  let item;

  if (section) {
    selector = getItemSelector(section);

    if (selector) {
      item = selector(section.id);
    }
  }

  if (!item) return null;

  const hasDetails = Object.keys(item.details || {}).length > 0;

  return (
    <h4>
      {hasDetails && Object.values(item.details).map((detail, i) => (
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
  const hasSection = Boolean(section);
  const hasSubhead = Boolean(section?.subtitle);

  const hasLink = getHasLink(section?.slug);

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

        {hasSection && (
          <div className='header-section'>
            <div className={cx('header-section-icon', hasLink && 'has-link')}>
              {hasLink ? (
                <WhenSection section={section}>
                  {(item) => (
                    <SectionLink slug={item?.slug} aria-label='section-icon'>
                      <SectionIcon name={icon} slug={item?.slug} />
                    </SectionLink>
                  )}
                </WhenSection>
              ) : (
                <SectionIcon name={icon} slug={section?.slug} />
              )}
            </div>

            <div className='header-section-title'>
              <h2>
                {hasLink ? (
                  <SectionLink slug={section?.slug} aria-label='section-title'>
                    {title ?? section?.title}
                  </SectionLink>
                ) : (
                  title ?? section?.title
                )}
              </h2>
              {hasSubhead && (
                <>
                  <SectionDescriptionLink section={section} />
                  <SectionDescription section={section} />
                </>
              )}
            </div>
          </div>
        )}
      </HeaderOverview>

      {children}
    </Header>
  );
};

export default SectionHeader;
