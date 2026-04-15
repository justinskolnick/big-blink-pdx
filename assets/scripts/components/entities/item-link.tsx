import React, { ReactNode } from 'react';

import {
  BetterLink as Link,
  LinkToEntity,
} from '../links';

import type { EntityObject } from '../../types';

interface Props {
  children: ReactNode;
  className?: string;
  item: EntityObject;
}

const ItemLink = ({ children, className, item }: Props) => {
  if (!item.links?.self) {
    console.log('*', item);
  }

  return item.links?.self ? (
    <Link to={item.links?.self} className={className}>{children}</Link>
  ) : (
    <LinkToEntity id={item.id} className={className}>{children}</LinkToEntity>
  );
};

export default ItemLink;
