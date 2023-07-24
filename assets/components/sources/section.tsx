import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { RootState } from '../../lib/store';

import { LinkToSources, LinkToSource } from '../links';
import SectionHeader, { getSectionTitle } from '../section-header';

import { selectors } from '../../reducers/sources';

interface Props {
  icon: IconName;
  name: string;
}

const Section = ({
  icon,
  name,
}: Props) => {
  const { id } = useParams();
  const source = useSelector((state: RootState) => selectors.selectById(state, id));
  const title = getSectionTitle(name, source?.title);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <SectionHeader
        icon={icon}
        title={name}
        LinkComponent={LinkToSources}
      >
        {source && <LinkToSource id={source.id}>{source.title}</LinkToSource>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
