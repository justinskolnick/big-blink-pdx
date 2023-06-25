import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { RootState } from '../../lib/store';

import { LinkToPeople, LinkToPerson } from '../links';
import { getIconName } from './icon';
import SectionHeader, { getSectionTitle } from '../section-header';

import { selectors } from '../../reducers/people';

interface Props {
  icon: IconName;
  name: string;
}

const Section = ({
  icon,
  name,
}: Props) => {
  const { id } = useParams();
  const person = useSelector((state: RootState) => selectors.selectById(state, id));
  const title = getSectionTitle(name, person?.name);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <SectionHeader
        icon={person?.type ? getIconName(person) : icon}
        title={name}
        LinkComponent={LinkToPeople}
      >
        {person && <LinkToPerson id={person.id}>{person.name}</LinkToPerson>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
