import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { css, cx } from '@emotion/css';

import Icon from './icon';

const styles = css`
  display: inline-flex;
  align-items: flex-start;

  .icon {
    color: inherit;
    font-size: 12px;
  }

  .item-text + .icon,
  .icon + .item-text {
    margin-left: 0.5ch;
  }
`;

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
  <span className={cx('item-text-with-icon', styles)}>
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
