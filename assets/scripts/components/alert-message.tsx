import React, { useEffect, useState } from 'react';

import Alert from './alert';

import useDispatch from '../hooks/use-app-dispatch';
import useSelector from '../hooks/use-app-selector';

import { actions as uiActions } from '../reducers/ui';

import { getMessages } from '../selectors';

const AlertMessage = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const dispatch = useDispatch();

  const deactivate = () => {
    setIsActive(false);

    setTimeout(() => {
      dispatch(uiActions.clearMessages());
    }, 250);
  };

  const alerts = useSelector(getMessages);
  const hasAlerts = alerts.length > 0;

  useEffect(() => {
    if (hasAlerts) {
      setIsActive(true);
    }
  }, [hasAlerts]);

  return (
    <Alert
      alerts={alerts}
      deactivate={deactivate}
      grade='message'
      isActive={isActive}
    />
  );
};

export default AlertMessage;
