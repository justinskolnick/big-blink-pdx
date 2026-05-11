import React, { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Header from './section-header';
import HeaderIntro from './section-header-intro';

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
  const location = useLocation();
  const isHome = location.pathname === '/';
  const section = location.pathname.split('/').at(1) || 'home';
  const className = ['section', section].join('-');

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
