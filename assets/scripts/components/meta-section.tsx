import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Icon from './icon';

interface Props {
  children: ReactNode;
}

interface BoxProps {
  children: ReactNode;
  className: string;
  icon?: IconName;
  title: string;
}

export const MetaSectionBox = ({ children, className, icon, title }: BoxProps) => {
  const hasIcon = Boolean(icon);

  return (
    <div className={cx(
      'meta-section-box',
      className,
      hasIcon && 'has-icon',
    )}>
      {hasIcon && (
        <div className='meta-section-box-icon'>
          <Icon name={icon} />
        </div>
      )}

      <div className='meta-section-box-content'>
        <div className='meta-section-box-title'>
          <h6>{title}</h6>
        </div>

        <div className='meta-section-box-description'>
          {children}
        </div>
      </div>
    </div>
  );
};

const MetaSection = ({ children }: Props) => (
  <div className='meta-section'>
    {children}
  </div>
);

export default MetaSection;
