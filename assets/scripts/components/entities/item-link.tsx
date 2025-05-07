import React, { ReactNode } from 'react';

import {
  BetterLink as Link,
  LinkToEntity,
} from '../links';

import type { Entity } from '../../types';

interface Props {
  children: ReactNode;
  className?: string;
  item: Entity;
}

const ItemLink = ({ children, className, item }: Props) => {
  const hasSelfLink = Boolean(item?.links?.self);

  if (!hasSelfLink) {
    console.log('*', item);
  }

  return hasSelfLink ? (
    <Link to={item.links.self} className={className}>{children}</Link>
  ) : (
    <LinkToEntity id={item.id} className={className}>{children}</LinkToEntity>
  );
};

export default ItemLink;
