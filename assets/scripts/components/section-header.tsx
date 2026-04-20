import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Eyes from './eyes';
import Header, { HeaderOverview } from './header';
import {
  BetterLink as Link,
  GlobalLink,
} from './links';
import SectionIcon from './section-icon';

import useSelector from '../hooks/use-app-selector';

import { getSection } from '../selectors';
import { useGetEntityById } from '../reducers/entities';
import { useGetIncidentById } from '../reducers/incidents';
import { useGetPersonById } from '../reducers/people';
import { useGetSourceById } from '../reducers/sources';

import {
  type Id,
  type ItemObject,
  type Slug,
  Sections,
} from '../types';

type LinkObject = {
  label: string;
  path: string;
};

interface Props {
  children?: ReactNode;
  icon?: IconName;
  title?: ReactNode | string;
}

interface DescriptionLinkProps {
  link?: LinkObject;
}

interface DescriptionProps {
  id?: Id;
  slug: Slug;
}

interface IconLinkProps {
  icon?: IconName;
  link: LinkObject;
  slug: Slug;
}

interface TitleLinkProps {
  link: LinkObject;
  title: ReactNode | string;
}

const useGetItemSelector = (slug: Slug, id?: Id): ItemObject | null => {
  const slugValue: string = slug;
  const slugValues: string[] = Object.values(Sections);

  if (id && slugValues.includes(slugValue)) {
    if (slug === Sections.Entities) {
      return useGetEntityById(id);
    } else if (slug === Sections.Incidents) {
      return useGetIncidentById(id);
    } else if (slug === Sections.People) {
      return useGetPersonById(id);
    } else if (slug === Sections.Sources) {
      return useGetSourceById(id);
    }
  }

  return null;
};

const SectionDescriptionLink = ({ link }: DescriptionLinkProps) => (
  <h3>
    {link ? (
      <Link to={link?.path}>
        {link?.label}
      </Link>
    ) : null}
  </h3>
);

const SectionDescription = ({ id, slug }: DescriptionProps) => {
  const item = useGetItemSelector(slug, id);
  const details = Object.values(item?.details ?? {});

  if (!item) return null;

  const hasDetails = details.length > 0;

  return (
    <h4>
      {hasDetails && details.map((detail, i) => (
        <span key={i} className='header-section-detail'>{detail}</span>
      ))}
    </h4>
  );
};

const HeaderIdentityLogo = () => (
  <h1>
    <GlobalLink to='/' className='header-identity-link'>
      <span className='text-secondary'>The</span>
      {' '}
      <span className='text-primary'>Big Blink</span>
      {' '}
      <span className='text-secondary'>PDX</span>
    </GlobalLink>
  </h1>
);

const HeaderIdentityEyes = () => (
  <div className='header-identity-eyes'>
    <Eyes />
  </div>
);

const SectionIconLink = ({ icon, link, slug }: IconLinkProps) => (
  <Link to={link.path} aria-label='section-icon'>
    <SectionIcon name={icon} slug={slug} />
  </Link>
);

const SectionTitleLink = ({ link, title }: TitleLinkProps) => (
  <Link to={link.path} aria-label='section-title'>
    {title}
  </Link>
);

const SectionHeader = ({
  children,
  icon,
  title,
}: Props) => {
  const section = useSelector(getSection);
  const hasSubhead = Boolean(section?.subtitle);

  return (
    <Header className={hasSubhead && 'has-subheader'}>
      <HeaderOverview>
        <div className='header-identity'>
          <HeaderIdentityLogo />
          <HeaderIdentityEyes />
        </div>

        {section && (
          <div className='header-section'>
            <div className={cx('header-section-icon', section.links && 'has-link')}>
              {section?.links ? (
                <SectionIconLink
                  icon={icon}
                  link={section.links?.section}
                  slug={section?.slug ?? ''}
                />
              ) : (
                <SectionIcon name={icon} slug={section?.slug ?? ''} />
              )}
            </div>

            <div className='header-section-title'>
              <h2>
                {section.links ? (
                  <SectionTitleLink
                    link={section.links?.section}
                    title={title ?? section.title}
                  />
                ) : (
                  title ?? section?.title
                )}
              </h2>
              {hasSubhead && (
                <>
                  <SectionDescriptionLink
                    link={section.links?.detail}
                  />
                  <SectionDescription
                    id={section.id}
                    slug={section?.slug ?? ''}
                  />
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
