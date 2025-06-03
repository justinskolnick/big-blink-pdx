import React from 'react';
import { useSelector } from 'react-redux';

import { getLeaderboardLabels } from '../../selectors';

import Icon from '../icon';

const Header = () => {
  const labels = useSelector(getLeaderboardLabels);

  return (
    <header className='leaderboard-section-header'>
      <Icon name='trophy' />

      <div className='leaderboard-section-header-content'>
        <h3>{labels.title}</h3>
        <h4>{labels.period}</h4>
      </div>
    </header>
  );
};

export default Header;
