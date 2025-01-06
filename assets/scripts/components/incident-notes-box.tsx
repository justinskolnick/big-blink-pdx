import React from 'react';

import { MetaSectionBox } from './meta-section';

import type { Incident } from '../types';

interface Props {
  incident: Incident;
  title: string;
}

const IncidentNotesBox = ({ incident, title }: Props) => (
  <MetaSectionBox
    className='incident-notes-box'
    icon='asterisk'
    title={title}
  >
    {incident.notes || 'None'}
  </MetaSectionBox>
);

export default IncidentNotesBox;
