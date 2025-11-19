import React from 'react';
import { cx } from '@emotion/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconName, SizeProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faAsterisk,
  faBriefcase,
  faBuilding,
  faChartLine,
  faChartSimple,
  faCheck,
  faChevronRight,
  faCircleQuestion,
  faDatabase,
  faFileCsv,
  faFileExcel,
  faFilter,
  faHandshake,
  faLandmark,
  faLink,
  faMinus,
  faPlus,
  faThumbtack,
  faTriangleExclamation,
  faTrophy,
  faUserGroup,
  faUserLarge,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendar,
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faAsterisk,
  faBriefcase,
  faBuilding,
  faCalendar,
  faChartLine,
  faChartSimple,
  faCheck,
  faChevronRight,
  faCircleQuestion,
  faDatabase,
  faFileCsv,
  faFileExcel,
  faFilter,
  faHandshake,
  faLandmark,
  faLink,
  faMinus,
  faPlus,
  faThumbtack,
  faTriangleExclamation,
  faTrophy,
  faUserGroup,
  faUserLarge,
);

import { BetterLink as Link } from './links';

import type { LocationState } from '../types';

enum IconSets {
  Regular = 'far',
  Solid = 'fas',
}

enum SetForIcon {
  'arrow-down' = IconSets.Solid,
  'arrow-left' = IconSets.Solid,
  'arrow-right' = IconSets.Solid,
  'arrow-up' = IconSets.Solid,
  'asterisk' = IconSets.Solid,
  'briefcase' = IconSets.Solid,
  'building' = IconSets.Solid,
  'calendar' = IconSets.Regular,
  'chart-line' = IconSets.Solid,
  'chart-simple' = IconSets.Solid,
  'check' = IconSets.Solid,
  'chevron-right' = IconSets.Solid,
  'circle-question' = IconSets.Solid,
  'database' = IconSets.Solid,
  'file-csv' = IconSets.Solid,
  'file-excel' = IconSets.Solid,
  'filter' = IconSets.Solid,
  'handshake' = IconSets.Solid,
  'landmark' = IconSets.Solid,
  'link' = IconSets.Solid,
  'minus' = IconSets.Solid,
  'plus' = IconSets.Solid,
  'thumbtack' = IconSets.Solid,
  'triangle-exclamation' = IconSets.Solid,
  'trophy' = IconSets.Solid,
  'user-group' = IconSets.Solid,
  'user-large' = IconSets.Solid,
}

interface Props {
  className?: string;
  name: IconName;
  size?: SizeProp;
  title?: string;
}

interface LinkIconProps extends Props {
  to: string | LocationState;
}

interface FnGetIconFromSet {
  (name: IconName): [SetForIcon, IconName];
}

const getIconFromSet: FnGetIconFromSet = (name) => [SetForIcon[name as keyof typeof SetForIcon], name];

export const LinkIcon = ({ className, name, size = 'lg', title, to }: LinkIconProps) => (
  <Link className={cx(`icon icon-${name} link-icon`, className)} to={to} title={title}>
    <FontAwesomeIcon icon={getIconFromSet(name)} size={size} />
  </Link>
);

const Icon = ({ className, name, size = 'lg', title }: Props) => (
  <span className={cx(`icon icon-${name}`, className)} title={title}>
    <FontAwesomeIcon icon={getIconFromSet(name)} size={size} />
  </span>
);

export default Icon;
