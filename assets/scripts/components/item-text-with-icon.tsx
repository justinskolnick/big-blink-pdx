import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Icon from './icon';
import ItemText from './item-text';

interface Props {
  after?: boolean;
  children: ReactNode;
  className?: string;
  icon?: IconName;
}

const ItemTextWithIcon = ({
  after = false,
  children,
  className,
  icon
}: Props) => (
  <span className={cx('item-text-with-icon', className)}>
    {icon ? (
      after ? (
        <>
          <ItemText>{children}</ItemText>
          <Icon name={icon} />
        </>
      ) : (
        <>
          <Icon name={icon} />
          <ItemText>{children}</ItemText>
        </>
      )
    ) : (
      <ItemText>{children}</ItemText>
    )}
  </span>
);

export default ItemTextWithIcon;
