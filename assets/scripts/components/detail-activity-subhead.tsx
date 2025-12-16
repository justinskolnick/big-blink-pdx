import React from 'react';

import { IconName } from '@fortawesome/fontawesome-svg-core';

import ItemSubhead from './item-subhead';

interface Props {
  icon?: IconName;
  title: string;
}

const ActivitySubhead = ({
  icon,
  title,
}: Props) => (
  <ItemSubhead
    subtitle={title}
    className='activity-subheader'
    icon={icon}
  />
);

export default ActivitySubhead;
