import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ItemText = ({ children }: Props) => (
  <span className='item-text'>{children}</span>
);

export default ItemText;
