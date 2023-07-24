import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

const styles = css`
  .item-article {
    a {
      color: var(--color-link);
    }
  }

  .item-content + .item-footer {
    margin-top: 2rem;
  }

  .item-content + .incident-list-section {
    margin-top: 36px;
  }

  .activity-meta-section + .activity-stat-section {
    padding-top: calc(3 * var(--gap));
  }

  .activity-stat-section + .activity-stat-section {
    margin-top: calc(3 * var(--gap));
  }

  .activity-overview + .incident-activity-stat-groups {
    padding-top: calc(3 * var(--gap));
    border-top: 3px solid var(--color-divider);
  }

  @media screen and (max-width: 600px) {
    padding-left: var(--layout-margin);
    padding-right: var(--layout-margin);
  }
`;

interface Props {
  children: ReactNode;
  className?: string;
}

const ItemDetail = ({ children, className }: Props) => (
  <section className={cx('item-detail', styles, className)}>
    {children}
  </section>
);

export default ItemDetail;
