import React, { ReactNode } from 'react';

import {
  BetterLink as Link,
  LinkToPerson,
} from '../links';

import type { PersonObject } from '../../types';

interface Props {
  children: ReactNode;
  className?: string;
  item: PersonObject;
}

const ItemLink = ({ children, className, item }: Props) => {
  if (!item.links?.self) {
    console.log('*', item);
  }

  return item.links?.self ? (
    <Link to={item.links?.self} className={className}>{children}</Link>
  ) : (
    <LinkToPerson id={item.id} className={className}>{children}</LinkToPerson>
  );
};

export default ItemLink;
