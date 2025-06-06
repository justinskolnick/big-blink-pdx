import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import ItemDescription from './item-description';
import ItemSubhead from './item-subhead';

interface Props {
  children?: ReactNode;
  icon?: IconName;
  title: string | ReactNode;
}

const SubsectionSubhead = ({
  children,
  icon,
  title,
}: Props) => (
  <div className='subsection-header'>
    <ItemSubhead title={title} icon={icon}>
      {children && (
        <ItemDescription>{children}</ItemDescription>
      )}
    </ItemSubhead>
  </div>
);

export default SubsectionSubhead;
