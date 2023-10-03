import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { RootState } from '../../lib/store';

import { LinkToPeople, LinkToPerson } from '../links';
import { getIconName } from './icon';
import SectionHeader from '../section-header';

import { selectors } from '../../reducers/people';
import { getSection } from '../../selectors';

interface Props {
  icon: IconName;
}

const Section = ({ icon }: Props) => {
  const { id } = useParams();
  const person = useSelector((state: RootState) => selectors.selectById(state, id));
  const section = useSelector(getSection);

  return (
    <>
      <SectionHeader
        icon={person?.type ? getIconName(person) : icon}
        LinkComponent={LinkToPeople}
      >
        {section.subtitle && <LinkToPerson id={section.id}>{section.subtitle}</LinkToPerson>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
