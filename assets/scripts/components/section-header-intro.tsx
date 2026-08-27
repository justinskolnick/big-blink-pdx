import React, { useCallback, useEffect, useState, useRef, KeyboardEvent, MouseEvent } from 'react';
import { cx } from '@emotion/css';

import Icon from './icon';
import IncidentModal from './incident-modal';

import useDispatch from '../hooks/use-app-dispatch';
import useSelector from '../hooks/use-app-selector';

import { actions as uiActions } from '../reducers/ui';

import { getHomeHeader } from '../selectors';

import type {
  RefElement,
  RefLinkElement,
} from '../types';

interface Props {
  note: string;
}

const DateRangeNote = ({ note }: Props) => {
  const ref = useRef<RefLinkElement>(null);
  const dispatch = useDispatch();

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(uiActions.setMessage({
      customMessage: note,
      message: note,
    }));
  };
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Enter' && event.target === ref.current) {
      event.preventDefault();
      event.stopPropagation();

      dispatch(uiActions.setMessage({
        customMessage: note,
        message: note,
      }));
    }
  }, [note, ref]);

  return (
    <a className='global-date-range-note' onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0} ref={ref}>
      <Icon name='asterisk' />
    </a>
  );
};

const HeaderIntro = () => {
  const ref = useRef<RefElement>(null);

  const [provisionalId, setProvisionalId] = useState<number | null>();
  const [selectedId, setSelectedId] = useState<number | null>();

  const header = useSelector(getHomeHeader);
  const hasIntro = 'intro' in header;
  const hasProvisionalId = typeof provisionalId === 'number';
  const hasSelectedId = typeof selectedId === 'number';
  const isLoading = !hasIntro;

  const deactivate = useCallback(() => {
    const element = ref.current?.querySelector(`a[data-id="${selectedId}"]`) as HTMLElement;

    setSelectedId(null);

    if (element) {
      element.focus();
    }
  }, [ref, selectedId, setSelectedId]);

  const handleClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLAnchorElement) {
      if (event.target.tagName === 'A') {
        if (event.target.dataset.id && !Number.isNaN(event.target.dataset.id)) {
          event.preventDefault();
          event.stopPropagation();

          setSelectedId(Number(event.target.dataset.id));
        }
      }
    }
  };

  useEffect(() => {
    const match = header.intro?.match(/data-id="([\d]+)"/);

    if (match) {
      const [, id] = match;
      setProvisionalId(Number(id));
    }
  }, [header, setProvisionalId]);

  return (
    <div className={cx('header-intro', isLoading && 'is-loading')}>
      {header && (
        <p onClick={handleClick}>
          <span
            dangerouslySetInnerHTML={{ __html: header.intro }}
            ref={ref}
          />
          <DateRangeNote note={header.note} />
        </p>
      )}

      {hasProvisionalId && (
        <IncidentModal
          deactivate={deactivate}
          id={selectedId || provisionalId}
          isActive={hasSelectedId}
        />
      )}
    </div>
  );
};

export default HeaderIntro;
