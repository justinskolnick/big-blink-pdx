import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { LinkToEntities, LinkToEntity } from '../links';
import SectionHeader from '../section-header';

import { getSection } from '../../selectors';

interface Props {
  icon: IconName;
}

const Section = ({ icon }: Props) => {
  const section = useSelector(getSection);
  const hasDetails = section?.details?.length > 0;

  return (
    <>
      <SectionHeader
        icon={icon}
        LinkComponent={LinkToEntities}
        details={hasDetails && section.details.map((detail, i) => (
          <span key={i} className='section-header-detail'>{detail}</span>
        ))}
      >
        {section.subtitle && <LinkToEntity id={section.id}>{section.subtitle}</LinkToEntity>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
