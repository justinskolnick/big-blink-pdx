import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { RootState } from '../../lib/store';

import { LinkToIncidents, LinkToIncident } from '../links';
import SectionHeader, { getSectionTitle } from '../section-header';

import { selectors } from '../../reducers/incidents';

interface Props {
  icon: IconName;
  name: string;
}

const Section = ({
  icon,
  name,
}: Props) => {
  const { id } = useParams();
  const incident = useSelector((state: RootState) => selectors.selectById(state, id));
  const title = getSectionTitle(name, incident ? 'Incident' : null);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <SectionHeader
        icon={icon}
        title={name}
        LinkComponent={LinkToIncidents}
      >
        {incident && <LinkToIncident id={incident.id}>Incident</LinkToIncident>}
      </SectionHeader>

      <Outlet />
    </>
  );
};

export default Section;
