import React, { useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { cx, css } from '@emotion/css';

import Eyes from './eyes';
import { GlobalLink, LinkToIncidents, LinkToIncident } from './links';
import Icon from './icon';
import IncidentModal from './incident-modal';

import { actions as uiActions } from '../reducers/ui';

import {
  getIncidentFirst,
  getIncidentLast,
  getIncidentTotal,
} from '../selectors';

const styles = css`
  .global-header-content {
    padding: 0 calc(var(--gap) * 2) var(--gap);
    background-color: var(--color-background);
    box-shadow: 0px 3px 9px var(--color-light-brown);
  }

  h1 {
    position: relative;
    top: calc(var(--gap) * -1);
    font-family: 'Darumadrop One';
    text-transform: uppercase;

    .global-header-link {
      display: flex;
      align-items: center;
      border-radius: calc(var(--gap) / 2);
      background-color: var(--color-link);
      color: var(--color-background);
      overflow: hidden;

      &:hover {
        border-bottom: none;
      }
    }

    .global-header-link-icon,
    .global-header-link-text {
      box-sizing: border-box;
    }

    .global-header-link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: calc(var(--gap) / 2);
      width: calc(var(--gap) / 2 * 7);
      height: 100%;
      background-color: var(--color-dark-blue);
      color: var(--color-background);
      font-size: calc(var(--gap) / 2);
      transition: background-color 250ms ease-in-out;

      .eyes {
        width: 36px;
        height: 11px;
        gap: 1.5px;
      }

      .icon {
        width: 11px;
        height: 11px;
        transition: transform 125ms ease-in-out;
      }
    }

    .global-header-link-text {
      display: flex;
      align-items: baseline;
      justify-content: center;
      padding: var(--gap) calc(var(--gap) / 2 * 3);
      background-color: var(--color-link);
      white-space: nowrap;
      transition: background-color 250ms ease-in-out,
                  box-shadow 250ms ease-in-out,
                  transform 250ms ease-in-out;

      .text-primary {
        margin: 0 0.25ch;
      }

      .text-secondary {
        color: rgba(var(--color-background-rgb), 0.5);
        font-size: 75%;
      }
    }
  }

  p {
    font-weight: 200;

    a {
      color: var(--color-link);
    }

    .icon {
      position: relative;
      top: -0.75em;
      color: var(--color-accent-alt-lighter);
      font-size: 0.5em;
    }
  }

  .global-date-range-note {
    cursor: pointer;
  }

  @media screen and (min-width: 601px) {
    padding-left: calc(var(--layout-margin) / 2);
    padding-right: calc(var(--layout-margin) / 2);

    .global-header-content {
      padding: 0 calc(var(--gap) * 2) var(--gap);
    }

    h1 {
      top: calc(var(--gap) * -1);
      display: flex;
      justify-content: center;

      .global-header-link {
        &:hover {
          .global-header-link-icon {
            background-color: var(--color-black);

            .icon {
              transform: scale(1, 1.5);
            }
          }

          .global-header-link-text {
            transform: translateX(calc(var(--gap) / 2 * 7 * -1));
          }
        }
      }

      .global-header-link-text {
        height: calc(var(--gap) * 4);
        transform: translateX(calc(var(--gap) / 6 * -1));
      }
    }

    h1 + p {
      margin-top: calc(var(--gap) / 2 * -1);
    }
  }

  @media screen and (max-width: 600px) {
    padding-left: calc(var(--layout-margin) / 2);
    padding-right: calc(var(--layout-margin) / 2);

    .global-header-content {
      padding: 0 var(--gap) var(--gap);
    }

    h1 {
      display: block;
      top: calc(var(--gap) / 2 * -1);

      .global-header-link {
        display: block;
        text-align: center;
      }

      .global-header-link-icon {
        display: none;
      }

      .global-header-link-text {
        padding: calc(var(--gap) / 2);
      }
    }
  }

  @media screen and (min-width: 401px) {
    h1 {
      font-size: 36px;
    }

    p {
      font-size: 24px;
      line-height: 45px;
    }
  }

  @media screen and (max-width: 400px) {
    h1 {
      font-size: 30px;
    }

    p {
      font-size: 18px;
      line-height: 27px;
    }
  }
`;

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

const GlobalHeader = () => {
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

  return (
    <header className={cx('global-header', styles)}>
      <div className='global-header-content'>
        <h1>
          <GlobalLink to='/' className='global-header-link'>
            <span className='global-header-link-icon'><Eyes /></span>
            <span className='global-header-link-text'>
              <span className='text-secondary'>The</span>
              <span className='text-primary'>Big Blink</span>
              <span className='text-secondary'>PDX</span>
            </span>
          </GlobalLink>
        </h1>

        {hasData && (
          <p>
            remixes lobbying data published by the City of Portland, Oregon, including
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
        )}
        {hasData && (
          <>
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
          </>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;
