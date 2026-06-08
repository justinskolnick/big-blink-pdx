import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Header from './section-header';
import HeaderIntro from './section-header-intro';

import useSelector from '../hooks/use-app-selector';

import { getCurrent } from '../selectors';

interface Props {
  children: ReactNode;
  icon: IconName;
  title: ReactNode | string;
}

const Section = ({
  children,
  icon,
  title,
}: Props) => {
  const current = useSelector(getCurrent);

  const isHome = current?.layout === 'home';
  const section = current?.section;

  const className = ['section', section].join('-');

  if (!current) return null;

  return (
    <section className={cx('section', className)}>
      <Header title={title} icon={icon}>
        {isHome && <HeaderIntro />}
      </Header>

      <section className='section-main'>
        {children}
      </section>
    </section>
  );
};

export default Section;
