import React from 'react';

import ItemSubhead from './item-subhead';

interface Props {
  title: string;
}

const ActivityHeader = ({ title }: Props) => (
  <ItemSubhead
    title={title}
    className='activity-header'
  />
);

export default ActivityHeader;
