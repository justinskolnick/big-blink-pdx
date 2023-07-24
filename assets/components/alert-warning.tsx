import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from './alert';

import { actions as uiActions } from '../reducers/ui';

import { getWarnings } from '../selectors';

const AlertWarning = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const dispatch = useDispatch();

  const deactivate = () => {
    setIsActive(false);

    setTimeout(() => {
      dispatch(uiActions.clearWarnings());
    }, 250);
  };

  const alerts = useSelector(getWarnings);
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
      grade='warning'
      isActive={isActive}
    />
  );
};

export default AlertWarning;
