import React from 'react';
import { useSelector } from 'react-redux';

import Header, { HeaderOverview } from '../header';

import { getLeaderboardLabels } from '../../selectors';

import Icon from '../icon';

const LeaderboardHeader = () => {
  const labels = useSelector(getLeaderboardLabels);

  return (
    <Header>
      <HeaderOverview>
        <Icon name='trophy' />

        <div className='header-content'>
          <h3>{labels.title}</h3>
          <h4>{labels.period}</h4>
        </div>
      </HeaderOverview>

      <div className='header-intro'>
        <p>{labels.description}</p>
      </div>
    </Header>
  );
};

export default LeaderboardHeader;
