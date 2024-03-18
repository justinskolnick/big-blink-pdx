import React, { useEffect, useRef, KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import useFixedBodyWhenHasClass from '../hooks/use-fixed-body-when-has-class';

export const hasAlertClass = 'has-alert' as const;
export const alertRootId = 'alert-root' as const;
export const alertPortalId = 'alert-root-portal' as const;

interface Props {
  children: ReactNode;
  deactivate: () => void;
  isActive: boolean;
}

const Escape = 'Escape' as const;

const AlertPortal = ({
  children,
  deactivate,
  isActive,
}: Props) => {
  const ref = useRef<HTMLDivElement>();
  const target = document.getElementById(alertPortalId);

  const handleClick = (): void => {
    deactivate();
  };
  const handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === Escape && isActive) {
      deactivate();
    }
  };

  useEffect(() => {
    isActive && ref.current?.focus();

    return () => {
      ref.current?.blur();
    };
  }, [ref, isActive]);

  useFixedBodyWhenHasClass(hasAlertClass);

  return createPortal(
    <div
      className='alert'
      onKeyUp={handleKeyUp}
      ref={ref}
      tabIndex={0}
    >
      <div className='alert-overlay' />
      <div className='alert-content' onClick={handleClick}>
        {children}
      </div>
    </div>,
    target
  );
};

export default AlertPortal;
