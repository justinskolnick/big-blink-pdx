import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

const styles = css`
  .item-content + .item-footer {
    margin-top: 2rem;
  }

  .item-content + .incident-list-section {
    margin-top: 36px;
  }

  .activity-meta-section + .activity-stat-section {
    padding-top: calc(3 * var(--gap));
  }

  .activity-overview + .incident-activity-stat-groups {
    margin-top: calc(3 * var(--gap));
    padding-top: calc(3 * var(--gap));
    border-top: 3px solid var(--color-section-divider);
  }

  .incident-activity-stat-groups + .incident-activity-stat-groups,
  .incident-activity-stat-groups + .incident-list-section {
    margin-top: calc(3 * var(--gap));
  }

  .item-overview-chart {
    padding: 18px;
    border-radius: 9px;
    background-color: var(--color-stat-light);
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
