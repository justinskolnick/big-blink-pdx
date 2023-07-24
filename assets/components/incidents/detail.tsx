import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { css } from '@emotion/css';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/incidents';

import IncidentSourceBox from '../incident-source-box';
import IncidentStatGroup from '../incident-stat-group';
import IncidentTable from '../incident-table';
import ItemDetail from '../item-detail';
import ItemSubhead from '../item-subhead';
import StatBox from '../stat-box';

const styles = css`
  --color-divider: var(--color-light-gray);

  .item-content-section {
    .incident-details + .item-subhead {
      margin-top: var(--gap);
    }
  }

  .item-subhead {
    color: var(--color-accent);

    h5 {
      font-weight: 600;
      font-size: 12px;
    }
  }

  .item-content-section-primary {
    .item-subhead + .incident-details {
      margin-top: var(--gap);
    }
  }

  .item-content-section-secondary {
    .item-subhead + .incident-details {
      margin-top: calc(var(--gap) / 2);
    }
  }

  .incident-table {
    width: 100%;

    a {
      color: var(--color-link);
    }
  }

  .activity-stat-group {
    .activity-stat {
      align-items: flex-start;
    }

    .activity-stat + .activity-stat {
      margin-top: var(--gap);
      padding-top: var(--gap);
      border-top: 1px solid var(--color-divider);
    }
  }

  @media screen and (max-width: 812px) {
    .item-content-section + .item-content-section {
      margin-top: calc(2 * var(--gap));
    }
  }

  @media screen and (min-width: 813px) {
    .item-content {
      display: grid;
      grid-template-columns: 3fr 2fr;
      grid-gap: calc(2 * var(--gap));
    }

    .item-content-section-secondary {
      padding-top: calc(2 * var(--gap));
    }
  }
`;

const Detail = () => {
  const { id } = useParams();

  const incident = useSelector((state: RootState) => selectors.selectById(state, id));

  if (!incident) return null;

  return (
    <ItemDetail className={styles}>
      <div className='item-content-section item-content-section-primary'>
        <ItemSubhead title='Details' />
        <div className='incident-details'>
          <IncidentTable incident={incident} />
        </div>
      </div>

      <div className='item-content-section item-content-section-secondary'>
        <IncidentStatGroup>
          <IncidentSourceBox
            incident={incident}
            title='Data source'
          />

          <StatBox title='Notes regarding this incident' icon='asterisk'>
            {incident.notes || 'None'}
          </StatBox>
        </IncidentStatGroup>
      </div>
    </ItemDetail>
  );
};

export default Detail;
