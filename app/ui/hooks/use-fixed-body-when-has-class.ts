import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getUI } from '../selectors';

const useFixedBodyWhenHasClass = (className: string) => {
  const { positionY } = useSelector(getUI);

  useEffect(() => {
    document.body.classList.add(className);
    document.body.style.position = 'fixed';

    if (positionY !== 0) {
      document.body.style.top = positionY + 'px';
    }

    return () => {
      document.body.classList.remove(className);
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, positionY * -1);
    };
  }, [positionY]);
};

export default useFixedBodyWhenHasClass;
