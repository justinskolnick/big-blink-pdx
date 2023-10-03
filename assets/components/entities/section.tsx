import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { RootState } from '../../lib/store';
import { toSentence } from '../../lib/string';

import { LinkToEntities, LinkToEntity } from '../links';
import SectionHeader from '../section-header';

import { selectors } from '../../reducers/entities';
import { getSection } from '../../selectors';

interface Props {
  icon: IconName;
}

const Section = ({ icon }: Props) => {
  const { id } = useParams();
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));
  const section = useSelector(getSection);
  const hasDomain = Boolean(entity?.domain);
  const hasLocations = Boolean(entity?.locations?.length);
  let locations;

  if (hasLocations) {
    locations = toSentence(entity.locations.map(location => `${location.city}, ${location.region}`));
  }

  return (
    <>
      <SectionHeader
        icon={icon}
        LinkComponent={LinkToEntities}
        details={
          <>
            {hasLocations && <span className='section-header-detail'>{locations}</span>}
            {hasDomain && <span className='section-header-detail'>{entity.domain}</span>}
          </>
        }
      >
        {section.subtitle && <LinkToEntity id={section.id}>{section.subtitle}</LinkToEntity>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
