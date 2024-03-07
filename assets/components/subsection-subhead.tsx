import React, { ReactNode } from 'react';

import ItemDescription from './item-description';
import ItemSubhead from './item-subhead';

interface Props {
  children?: ReactNode;
  title: string | ReactNode;
}

const SubsectionSubhead = ({ children, title }: Props) => (
  <div className='subsection-header'>
    <ItemSubhead title={title}>
      {children && (
        <ItemDescription>{children}</ItemDescription>
      )}
    </ItemSubhead>
  </div>
);

export default SubsectionSubhead;
