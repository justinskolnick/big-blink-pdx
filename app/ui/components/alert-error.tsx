import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from './alert';

import { actions as uiActions } from '../reducers/ui';

import { getErrors } from '../selectors';

const AlertError = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const dispatch = useDispatch();

  const deactivate = () => {
    setIsActive(false);

    setTimeout(() => {
      dispatch(uiActions.clearErrors());
    }, 250);
  };

  const alerts = useSelector(getErrors);
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
      grade='error'
      isActive={isActive}
    />
  );
};

export default AlertError;
