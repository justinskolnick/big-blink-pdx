import React, { useEffect, useRef, KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@emotion/css';

import useFixedBodyWhenHasClass from '../hooks/use-fixed-body-when-has-class';

export const hasModalClass = 'has-modal' as const;
export const modalRootId = 'modal-root' as const;
export const modalPortalId = 'modal-root-portal' as const;

interface Props {
  children: ReactNode;
  className: string;
  deactivate: () => void;
  isActive: boolean;
}

const Escape = 'Escape' as const;

const ModalPortal = ({
  children,
  className,
  deactivate,
  isActive,
}: Props) => {
  const ref = useRef<HTMLDivElement>();
  const target = document.getElementById(modalPortalId);

  const handleOverlayClick = (): void => {
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

  useFixedBodyWhenHasClass(hasModalClass);

  return createPortal(
    <div
      className={cx('modal', className)}
      onKeyUp={handleKeyUp}
      ref={ref}
      tabIndex={0}
    >
      <div
        className='modal-overlay'
        onClick={handleOverlayClick}
      />
      <div className='modal-content'>
        {children}
      </div>
    </div>,
    target
  );
};

export default ModalPortal;
