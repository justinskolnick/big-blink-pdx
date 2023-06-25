import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';

const styles = css`
  color: var(--color-black);
  line-height: 27px;

  &.has-border {
    padding-top: 9px;
    border-top: 3px solid var(--color-divider);
  }

  h4 {
    color: var(--color-accent);
  }

  h4 + h5,
  h5 + h5 {
    margin-left: 0.5ch;
  }

  &.item-subhead {
    .icon {
      flex-shrink: 0;
      box-sizing: border-box;
      width: 27px;
      height: 27px;
      border-radius: 50%;
      background-color: var(--color-accent-alt);
      color: var(--color-background);
      font-size: 10px;
      text-align: center;
    }

    .item-text {
      padding-top: 6px;
      padding-bottom: 6px;
      line-height: 18px;
    }

    .icon + .item-text,
    .item-text + .icon {
      margin-left: calc(var(--gap) / 2);
    }
  }
`;

interface Props {
  children?: ReactNode;
  className?: string;
  hasBorder?: boolean;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
}

const ItemSubhead = ({
  children,
  className,
  hasBorder,
  title,
  subtitle,
}: Props) => (
  <header
    className={cx(
      'item-subhead',
      hasBorder && 'has-border',
      styles,
      className
    )}
  >
    {title && <h4>{title}</h4>}
    {subtitle && <h5>{subtitle}</h5>}
    {children}
  </header>
);

export default ItemSubhead;
