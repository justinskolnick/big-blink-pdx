import React, { forwardRef, useEffect, KeyboardEvent, MouseEvent, MutableRefObject, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import useFixedBodyWhenHasClass from '../hooks/use-fixed-body-when-has-class';

export const hasAlertClass = 'has-alert';
export const alertRootId = 'alert-root';
export const alertPortalId = 'alert-root-portal';

interface Props {
  children: ReactNode;
  deactivate: () => void;
  isActive: boolean;
}

const Escape = 'Escape';

const AlertPortal = forwardRef<HTMLDivElement, Props>(({
  children,
  deactivate,
  isActive,
}, ref) => {
  const elementRef = ref as MutableRefObject<HTMLDivElement>;
  const target = document.getElementById(alertPortalId)!;

  const handleClick = (e: MouseEvent): void => {
    e.stopPropagation();

    if (e.target instanceof HTMLElement) {
      if (e.target.tagName !== 'A') {
        e.preventDefault();
      }
    }

    deactivate();
  };
  const handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === Escape && isActive) {
      deactivate();
    }
  };

  useEffect(() => {
    if (isActive) {
      elementRef.current?.focus();
    }

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
