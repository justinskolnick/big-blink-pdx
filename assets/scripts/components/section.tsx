import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Header from './header';
import HeaderIntro from './header-intro';

interface Props {
  children: ReactNode;
  className?: string;
  icon?: IconName;
  title?: ReactNode | string;
}

const Section = ({
  children,
  className,
  icon,
  title,
}: Props) => {
  const location = useLocation();
  const isRoot = location.pathname === '/';

  return (
    <section className={cx('section', className)}>
      <Header title={title} icon={icon}>
        {isRoot && <HeaderIntro />}
      </Header>


      <section className='section-main'>
        {children}
      </section>
    </section>
  );
};

export default Section;
