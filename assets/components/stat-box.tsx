import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx, css } from '@emotion/css';

import Icon from './icon';

interface Props {
  children: ReactNode;
  className?: string;
  icon?: IconName;
  onClick?: () => void;
  title?: string;
}

const styles = css`
  &.has-icon {
    display: flex;
    align-items: center;

    .icon {
      margin-right: 1ch;
      width: 30px;
      color: var(--color-text-light);
      font-size: 27px;

      svg {
        width: 100%;
      }
    }
  }

  .activity-stat-content {
    width: 100%;
  }
`;

const StatBox = ({
  children,
  className,
  icon,
  onClick,
  title,
}: Props) => (
  <div
    className={cx(
      'activity-stat',
      icon && 'has-icon',
      styles,
      className
    )}
    onClick={onClick}
  >
    {icon && <Icon name={icon} />}
    <div className='activity-stat-content'>
      {title && (
        <h6 className='activity-stat-titles'>
          {title && (
            <span className='activity-stat-title'>
              {title}
            </span>
          )}
        </h6>
      )}
      <div className='activity-stat-value'>
        {children}
      </div>
    </div>
  </div>
);

export default StatBox;
