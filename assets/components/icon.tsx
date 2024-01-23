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
  faChartSimple,
  faCheck,
  faChevronRight,
  faCircleQuestion,
  faDatabase,
  faFileCsv,
  faFilter,
  faHandshake,
  faLandmark,
  faLink,
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
  faChartSimple,
  faCheck,
  faChevronRight,
  faCircleQuestion,
  faDatabase,
  faFileCsv,
  faFilter,
  faHandshake,
  faLandmark,
  faLink,
  faTriangleExclamation,
  faTrophy,
  faUserGroup,
  faUserLarge,
);

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
  'chart-simple' = IconSets.Solid,
  'check' = IconSets.Solid,
  'chevron-right' = IconSets.Solid,
  'circle-question' = IconSets.Solid,
  'database' = IconSets.Solid,
  'file-csv' = IconSets.Solid,
  'filter' = IconSets.Solid,
  'handshake' = IconSets.Solid,
  'landmark' = IconSets.Solid,
  'link' = IconSets.Solid,
  'triangle-exclamation' = IconSets.Solid,
  'trophy' = IconSets.Solid,
  'user-group' = IconSets.Solid,
  'user-large' = IconSets.Solid,
}

interface Props {
  className?: string;
  name: IconName;
  size?: SizeProp;
}

const Icon = ({ className, name, size = 'lg' }: Props) => {
  const set = SetForIcon[name as keyof typeof SetForIcon];

  return (
    <span className={cx(`icon icon-${name}`, className)}>
      <FontAwesomeIcon icon={[set, name]} size={size} />
    </span>
  );
};

export default Icon;
