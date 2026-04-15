import React from 'react';

import {
  BetterLink as Link,
  LinkProps,
} from '../links';

import { type SourceObject } from '../../types';

interface Props extends LinkProps {
  item: SourceObject;
}

const ItemLink = ({ children, item, ...rest }: Props) =>
  item.links?.self ? (
    <Link to={item.links?.self} {...rest}>{children}</Link>
  ) : children;

export default ItemLink;
