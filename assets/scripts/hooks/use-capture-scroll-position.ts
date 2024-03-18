import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import debounce from 'debounce';

import { actions } from '../reducers/ui';

const useCaptureScrollPosition = (classNames: Array<string> = []) => {
  const dispatch = useDispatch();
  const [scrollPos, setScrollPos] = useState<number>(0);

  const handleScroll = () => {
    setScrollPos(Number(window.scrollY) * -1);

    if (classNames.some(className => document.body.classList.contains(className))) {
      setScrollPos(parseInt(document.body.style.top, 10));
    }
  };

  const debounced = debounce(handleScroll, 400);

  useEffect(() => {
    window.addEventListener('scroll', debounced);

    return () => {
      window.removeEventListener('scroll', debounced);
    };
  }, [debounced]);

  useEffect(() => {
    dispatch(actions.setPositionY(scrollPos));
  }, [dispatch, scrollPos]);
};

export default useCaptureScrollPosition;
