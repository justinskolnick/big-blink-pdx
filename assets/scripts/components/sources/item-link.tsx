import React, { ReactNode } from 'react';

import {
  BetterLink as Link,
  LinkToSource,
} from '../links';

import type { Source } from '../../types';

interface Props {
  children: ReactNode;
  className?: string;
  item: Source;
}

const ItemLink = ({ children, className, item }: Props) => {
  const hasSelfLink = Boolean(item?.links?.self);

  if (!hasSelfLink) {
    console.log('*', item);
  }

  return hasSelfLink ? (
    <Link to={item.links.self} className={className}>{children}</Link>
  ) : (
    <LinkToSource id={item.id} className={className}>{children}</LinkToSource>
  );
};

export default ItemLink;
