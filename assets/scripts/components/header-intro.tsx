import React, { useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { LinkToIncidents, LinkToIncident } from './links';
import Icon from './icon';
import IncidentModal from './incident-modal';

import { actions as uiActions } from '../reducers/ui';

import {
  getIncidentFirst,
  getIncidentLast,
  getIncidentTotal,
} from '../selectors';

const dateRangeMessage = 'Some incident dates appear to be anomalous and have been omitted from this range, pending official word from the City Auditor’s office. Refer to individual incident records for more details.' as const;

const DateRangeNote = () => {
  const dispatch = useDispatch();

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(uiActions.setMessage({
      message: dateRangeMessage,
    }));
  };

  return (
    <span className='global-date-range-note' onClick={handleClick}>
      <Icon name='asterisk' />
    </span>
  );
};

const HeaderIntro = () => {
  const { pathname } = useLocation();
  const [savedPathname, setSavedPathname] = useState<string>(pathname);
  const [selectedId, setSelectedId] = useState<number>();

  const total = useSelector(getIncidentTotal);
  const first = useSelector(getIncidentFirst);
  const last = useSelector(getIncidentLast);
  const hasFirst = Boolean(first);
  const hasLast = Boolean(last);
  const hasData = total > 0 && hasFirst && hasLast;

  const deactivate = () => setSelectedId(null);
  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target instanceof HTMLAnchorElement) {
      setSelectedId(Number(event.target.dataset.id));
    }
  };

  useEffect(() => {
    setSavedPathname(pathname);
  }, [setSavedPathname, pathname]);

  useEffect(() => {
    if (pathname !== savedPathname) {
      setSelectedId(null);
    }
  }, [pathname, savedPathname, setSelectedId]);

  if (!hasData) return null;

  return (
    <div className='header-intro'>
      <p>
        The Big Blink remixes lobbying data published by the City of Portland, Oregon, including
        {' '}
        <LinkToIncidents>{total} lobbying incidents</LinkToIncidents>
        {' '}
        reported between
        {' '}
        <LinkToIncident id={first.id} data-id={first.id} onClick={handleClick}>
          {first.contactDate}
        </LinkToIncident>
        {' '}
        and
        {' '}
        <LinkToIncident id={last.id} data-id={last.id} onClick={handleClick}>
          {last.contactDate}
        </LinkToIncident>
        .
        {' '}
        <DateRangeNote />
      </p>

      <IncidentModal
        deactivate={deactivate}
        id={first.id}
        isActive={selectedId === first.id}
      />
      <IncidentModal
        deactivate={deactivate}
        id={last.id}
        isActive={selectedId === last.id}
      />
    </div>
  );
};

export default HeaderIntro;
