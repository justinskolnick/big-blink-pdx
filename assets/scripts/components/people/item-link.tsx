import React, { ReactNode } from 'react';

import {
  BetterLink as Link,
  LinkToPerson,
} from '../links';

import type { Person } from '../../types';

interface Props {
  children: ReactNode;
  className?: string;
  item: Person;
}

const ItemLink = ({ children, className, item }: Props) => {
  const hasSelfLink = Boolean(item?.links?.self);

  if (!hasSelfLink) {
    console.log('*', item);
  }

  return hasSelfLink ? (
    <Link to={item.links.self} className={className}>{children}</Link>
  ) : (
    <LinkToPerson id={item.id} className={className}>{children}</LinkToPerson>
  );
};

export default ItemLink;
