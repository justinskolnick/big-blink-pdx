import React from 'react';

import {
  BetterLink as Link,
  LinkProps,
} from '../links';

import { type EntityObject } from '../../types';

interface Props extends LinkProps {
  item: EntityObject;
}

const ItemLink = ({ children, item, ...rest }: Props) =>
  item.links?.self ? (
    <Link to={item.links?.self} {...rest}>{children}</Link>
  ) : children;

export default ItemLink;
