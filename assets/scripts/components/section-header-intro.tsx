import React, { useEffect, useState, MouseEvent } from 'react';
import { useLocation } from 'react-router';

import {
  BetterLink as Link,
  LinkToIncidents,
} from './links';
import Icon from './icon';
import IncidentModal from './incident-modal';

import useDispatch from '../hooks/use-app-dispatch';
import useSelector from '../hooks/use-app-selector';

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
      customMessage: dateRangeMessage,
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
  const [selectedId, setSelectedId] = useState<number | null>();

  const total = useSelector(getIncidentTotal);
  const first = useSelector(getIncidentFirst);
  const last = useSelector(getIncidentLast);

  const deactivate = () => setSelectedId(null);
  const handleClick = (event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (event?.target instanceof HTMLAnchorElement) {
      setSelectedId(Number(event?.target.dataset.id));
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

  if (!first || !last || total === 0) return null;

  return (
    <div className='header-intro'>
      <p>
        The Big Blink remixes lobbying data published by the City of Portland, Oregon, including
        {' '}
        <LinkToIncidents>{total} lobbying incidents</LinkToIncidents>
        {' '}
        reported between
        {' '}
        <Link to={first?.links?.self} data-id={first?.id} onClick={handleClick}>
          {first?.contactDate}
        </Link>
        {' '}
        and
        {' '}
        <Link to={last?.links?.self} data-id={last?.id} onClick={handleClick}>
          {last?.contactDate}
        </Link>
        .
        {' '}
        <DateRangeNote />
      </p>

      <IncidentModal
        deactivate={deactivate}
        id={first?.id}
        isActive={selectedId === first.id}
      />
      <IncidentModal
        deactivate={deactivate}
        id={last?.id}
        isActive={selectedId === last?.id}
      />
    </div>
  );
};

export default HeaderIntro;
