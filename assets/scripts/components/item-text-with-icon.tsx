import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';
import ItemText from './item-text';

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
        <ItemText>{children}</ItemText>
        <Icon name={icon} />
      </>
    ) : (
      <>
        <Icon name={icon} />
        <ItemText>{children}</ItemText>
      </>
    )}
  </span>
);

export default ItemTextWithIcon;
