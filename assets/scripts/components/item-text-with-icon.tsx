import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';

interface Props {
  after?: boolean;
  children: ReactNode;
  icon: IconName;
}

const ItemTextWithIcon = ({
  after = false,
  children,
  icon
}: Props) => (
  <span className='item-text-with-icon'>
    {after ? (
      <>
        <span className='item-text'>{children}</span>
        <Icon name={icon} />
      </>
    ) : (
      <>
        <Icon name={icon} />
        <span className='item-text'>{children}</span>
      </>
    )}
  </span>
);

export default ItemTextWithIcon;
