import React, { PropsWithChildren } from 'react';
import { cx } from '@emotion/css';

interface Props extends PropsWithChildren {
  className?: string;
}

const SubsectionContent = ({ children, className }: Props) => (
  <div className={cx('subsection-content', className)}>
    {children}
  </div>
);

export default SubsectionContent;
