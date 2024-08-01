import React, { forwardRef, useEffect, KeyboardEvent, MutableRefObject, ReactNode } from 'react';
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

const AlertPortal = forwardRef<HTMLDivElement, Props>(({
  children,
  deactivate,
  isActive,
}, ref) => {
  const elementRef = ref as MutableRefObject<HTMLDivElement>;
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
    isActive && elementRef.current?.focus();

    return () => {
      elementRef.current?.blur();
    };
  }, [elementRef, isActive]);

  useFixedBodyWhenHasClass(hasAlertClass);

  return createPortal(
    <div
      className='alert'
      onKeyUp={handleKeyUp}
      ref={elementRef}
      tabIndex={0}
    >
      <div className='alert-overlay' />
      <div className='alert-content' onClick={handleClick}>
        {children}
      </div>
    </div>,
    target
  );
});

export default AlertPortal;
