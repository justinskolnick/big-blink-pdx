import React, { ReactNode } from 'react';

import ItemSubhead from './item-subhead';

interface Props {
  children?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
}

const IndexListHeader = ({
  children,
  subtitle,
  title,
}: Props) => (
  <ItemSubhead
    className='index-list-header'
    icon='table-list'
    title={title}
    subtitle={subtitle}
  >
    {children}
  </ItemSubhead>
);

export default IndexListHeader;
