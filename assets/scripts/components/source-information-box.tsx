import React from 'react';

import { MetaSectionBox } from './meta-section';

import type { SourceObject } from '../types';

enum DataFormatIcon {
  csv = 'file-csv',
  excel = 'file-excel',
}

interface Props {
  source: SourceObject;
  title: string;
}

const SourceInformationBox = ({ source, title }: Props) => {
  const icon = DataFormatIcon[source.format];

  return (
    <MetaSectionBox
      className='source-information-box'
      icon={icon}
      title={title}
    >
      <span dangerouslySetInnerHTML={{ __html: source.labels.disclaimer }} />
    </MetaSectionBox>
  );
};

export default SourceInformationBox;
