import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { RootState } from '../../lib/store';
import { toSentence } from '../../lib/string';

import { LinkToEntities, LinkToEntity } from '../links';
import SectionHeader, { getSectionTitle } from '../section-header';

import { selectors } from '../../reducers/entities';

interface Props {
  icon: IconName;
  name: string;
}

const Section = ({
  icon,
  name,
}: Props) => {
  const { id } = useParams();
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));
  const title = getSectionTitle(name, entity?.name);
  const hasLocations = Boolean(entity?.locations);
  let details;

  if (hasLocations) {
    details = toSentence(entity.locations.map(location => `${location.city}, ${location.region}`));
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <SectionHeader
        icon={icon}
        title={name}
        LinkComponent={LinkToEntities}
        details={details}
      >
        {entity && <LinkToEntity id={entity.id}>{entity.name}</LinkToEntity>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
