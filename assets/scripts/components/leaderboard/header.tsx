import React from 'react';
import { useSelector } from 'react-redux';

import { getLeaderboardLabels } from '../../selectors';

import Icon from '../icon';

const Header = () => {
  const labels = useSelector(getLeaderboardLabels);

  return (
    <header className='header'>
      <div className='header-overview leaderboard-section-header'>
        <Icon name='trophy' />

        <div className='header-content'>
          <h3>{labels.title}</h3>
          <h4>{labels.period}</h4>
        </div>
      </div>

      <div className='header-intro'>
        <p>{labels.description}</p>
      </div>
    </header>
  );
};

export default Header;
