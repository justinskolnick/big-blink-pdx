import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ItemSubsection = ({ children }: Props) => (
  <div className='item-subsection'>{children}</div>
);

export default ItemSubsection;
