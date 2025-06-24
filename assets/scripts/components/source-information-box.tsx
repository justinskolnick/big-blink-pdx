import React from 'react';

import { MetaSectionBox } from './meta-section';

import { DataFormat } from '../types';
import type { Source } from '../types';

enum DataFormatIcon {
  csv = 'file-csv',
}

interface Props {
  source: Source;
  title: string;
}

const sourceDisclaimers = {
  activity: 'Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
  registration: 'Data has been condensed and edited to facilitate database input, address obvious typos, and improve readability.',
} as Record<Source['type'], string>;

const SourceInformationBox = ({ source, title }: Props) => {
  const disclaimers = sourceDisclaimers[source.type];
  const format = DataFormat[source.format];
  const icon = DataFormatIcon[source.format];

  return (
    <MetaSectionBox
      className='source-information-box'
      icon={icon}
      title={title}
    >
      Data was retrieved on
      {' '}
      <strong>{source.retrievedDate}</strong>
      {' '}
      in
      {' '}
      <strong>{format}</strong> format
      {' '}
      from
      {' '}
      <strong><a href={source.publicUrl} target='_blank' rel='noreferrer'>{source.publicUrl}</a></strong>
      {' '}
      as published by the City of Portland’s Auditor’s Office in accordance with the City’s
      {' '}
      <a href='https://www.portland.gov/what-works-cities/making-data-publicly-accessible'>Open Data Policy</a>.
      {' '}
      {disclaimers}
    </MetaSectionBox>
  );
};

export default SourceInformationBox;
