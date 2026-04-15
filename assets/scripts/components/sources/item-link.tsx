import React, { ReactNode } from 'react';

import {
  BetterLink as Link,
  LinkToSource,
} from '../links';

import type { SourceObject } from '../../types';

interface Props {
  children: ReactNode;
  className?: string;
  item: SourceObject;
}

const ItemLink = ({ children, className, item }: Props) => {
  if (!item.links?.self) {
    console.log('*', item);
  }

  return item.links?.self ? (
    <Link to={item.links?.self} className={className}>{children}</Link>
  ) : (
    <LinkToSource id={item.id} className={className}>{children}</LinkToSource>
  );
};

export default ItemLink;
