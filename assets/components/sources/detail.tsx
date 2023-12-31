import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { css, cx } from '@emotion/css';

import { RootState } from '../../lib/store';

import ActivityOverview from '../incident-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import DetailIncidents from '../detail-incidents';
import Entities from './entities';
import Icon from '../icon';
import ItemDetail from '../item-detail';

import { selectors } from '../../reducers/sources';

import { DataFormat } from '../../types';

const styles = css`
  .activity-meta-section {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    overflow: hidden;
    border-radius: 9px;
    border: 1px solid var(--color-blue);

    header + & {
      margin-top: 36px;
    }
  }

  .activity-meta-section-icon {
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 24px 18px 18px;
    width: 63px;
    background-color: var(--color-light-blue);

    &.icon-csv {
      padding-left: 21px;
      padding-right: 15px;
    }

    .icon {
      color: var(--color-blue);
      font-size: 21px;
    }
  }

  .activity-meta-section-description {
    padding: 18px;
    color: var(--color-gray);
    font-size: 12px;
    line-height: 18px;

    strong {
      color: var(--color-text-light);
      font-weight: 500;
    }

    a {
      color: var(--color-link);

      &[target] {
        word-break: break-all;
      }
    }
  }

  .activity-meta-section + .activity-overview {
    margin-top: calc(3 * var(--gap));
  }
`;

const disclaimers = {
  activity: 'Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
  registration: 'Data has been condensed and edited to facilitate database input, address obvious typos, and improve readability.',
};

const Detail = () => {
  const ref = useRef<HTMLDivElement>();

  const scrollToRef = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { id } = useParams();

  const source = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasSource = Boolean(source);

  const label = source ? `Q${source.quarter} ${source.year}` : null;

  const isActivity = source?.type === 'activity';
  const incidents = source?.incidents;
  const hasIncidents = isActivity && Boolean(incidents);

  if (!hasSource) return null;

  return (
    <ItemDetail className={styles}>
      <section className='activity-meta-section item-source-file'>
        <div className={cx('activity-meta-section-icon', {
          'icon-csv': source.format === 'csv',
        })}>
          <Icon name='file-csv' />
        </div>
        <div className='activity-meta-section-description'>
          Data was retrieved on
          {' '}
          <strong>{source.retrievedDate}</strong>
          {' '}
          in
          {' '}
          <strong>{DataFormat[source.format]}</strong> format
          {' '}
          from
          {' '}
          <strong><a href={source.publicUrl} target='_blank' rel='noreferrer'>{source.publicUrl}</a></strong>
          {' '}
          as published by the City of Portland’s Auditor’s Office in accordance with the City’s
          {' '}
          <a href='https://www.portland.gov/what-works-cities/making-data-publicly-accessible'>Open Data Policy</a>.
          {' '}
          {disclaimers[source.type]}
        </div>
      </section>

      {hasIncidents && (
        <>
          <ActivityOverview
            incidents={incidents}
            scrollToRef={scrollToRef}
          >
            <Chart label={label} />
          </ActivityOverview>

          <Entities
            entities={source.entities}
            source={source}
          />

          <Attendees attendees={source.attendees} />

          <DetailIncidents
            ids={source.incidents?.ids}
            filters={source.incidents?.filters}
            hasSort
            label={source.title}
            pagination={source.incidents?.pagination}
            scrollToRef={scrollToRef}
            ref={ref}
          />
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
