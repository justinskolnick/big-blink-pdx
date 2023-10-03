import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { LinkToSources, LinkToSource } from '../links';
import SectionHeader from '../section-header';

import { getSection } from '../../selectors';

interface Props {
  icon: IconName;
}

const Section = ({ icon }: Props) => {
  const section = useSelector(getSection);

  return (
    <>
      <SectionHeader
        icon={icon}
        LinkComponent={LinkToSources}
      >
        {section.subtitle && <LinkToSource id={section.id}>{section.subtitle}</LinkToSource>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
