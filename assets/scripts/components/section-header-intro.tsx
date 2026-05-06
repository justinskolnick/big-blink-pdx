import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router';

import Icon from './icon';
import IncidentModal from './incident-modal';

import useDispatch from '../hooks/use-app-dispatch';
import useSelector from '../hooks/use-app-selector';

import { actions as uiActions } from '../reducers/ui';

import { getHomeHeader } from '../selectors';

interface Props {
  note: string;
}

const DateRangeNote = ({ note }: Props) => {
  const dispatch = useDispatch();

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(uiActions.setMessage({
      customMessage: note,
      message: note,
    }));
  };

  return (
    <span className='global-date-range-note' onClick={handleClick}>
      <Icon name='asterisk' />
    </span>
  );
};

const HeaderIntro = () => {
  const navigate = useNavigate();

  const [provisionalId, setProvisionalId] = useState<number | null>();
  const [selectedId, setSelectedId] = useState<number | null>();

  const header = useSelector(getHomeHeader);

  const deactivate = () => setSelectedId(null);
  const hasProvisionalId = typeof provisionalId === 'number';
  const hasSelectedId = typeof selectedId === 'number';

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target instanceof HTMLAnchorElement) {
      if (event.target.tagName === 'A') {
        if (event.target.dataset.id && !Number.isNaN(event.target.dataset.id)) {
          setSelectedId(Number(event.target.dataset.id));
        } else {
          navigate(event.target.pathname);
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
    <div className='header-intro'>
      {header && (
        <p onClick={handleClick}>
          <span dangerouslySetInnerHTML={{ __html: header.intro }} />
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
