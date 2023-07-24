import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx, css } from '@emotion/css';

import SectionHeader from './section-header';

const styles = css`
  .section-header + .section-main {
    margin-top: calc(2 * var(--gap));
  }

  @media screen and (max-width: 600px) {
    padding-left: var(--layout-margin);
    padding-right: var(--layout-margin);

    .section-header-title {
      h2 {
        font-size: 24px;
      }
    }
  }
`;

interface Props {
  children: ReactNode;
  className?: string;
  icon?: IconName;
  title: ReactNode | string;
}

const Section = ({
  children,
  className,
  icon,
  title,
}: Props) => (
  <section className={cx('section', styles, className)}>
    <SectionHeader title={title} icon={icon} />

    <main className='section-main'>
      {children}
    </main>
  </section>
);

export default Section;
