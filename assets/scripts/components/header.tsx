import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Eyes from './eyes';
import {
  GlobalLink,
  LinkToEntities,
  LinkToEntity,
  LinkToIncident,
  LinkToIncidents,
  LinkToPeople,
  LinkToPerson,
  LinkToSource,
  LinkToSources,
} from './links';
import SectionIcon from './section-icon';

import { getSection } from '../selectors';

const ENTITIES = 'entities' as const;
const INCIDENTS = 'incidents' as const;
const PEOPLE = 'people' as const;
const SOURCES = 'sources' as const;

const useGetSectionLink = (slug: string) => {
  if (slug === ENTITIES) {
    return LinkToEntities;
  } else if (slug === INCIDENTS) {
    return LinkToIncidents;
  } else if (slug === PEOPLE) {
    return LinkToPeople;
  } else if (slug === SOURCES) {
    return LinkToSources;
  }
};

const useGetSectionItemLink = (slug: string) => {
  if (slug === ENTITIES) {
    return LinkToEntity;
  } else if (slug === INCIDENTS) {
    return LinkToIncident;
  } else if (slug === PEOPLE) {
    return LinkToPerson;
  } else if (slug === SOURCES) {
    return LinkToSource;
  }
};

interface Props {
  children?: ReactNode;
  icon?: IconName;
  title?: ReactNode | string;
}

const Header = ({
  children,
  icon,
  title,
}: Props) => {
  const section = useSelector(getSection);
  const pageTitle = section.subtitle ? `${section.subtitle} · ${section.title}` : section.title;

  const slug = section.slug;

  const SectionLink = useGetSectionLink(slug);
  const SectionItemLink = useGetSectionItemLink(slug);

  const hasLink = Boolean(SectionLink);
  const hasSubhead = Boolean(section.subtitle);
  const hasDetails = section.details?.length > 0;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

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
                    <SectionItemLink id={section.id}>{section.subtitle}</SectionItemLink>
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
    </>
  );
};

export default Header;
