import React, { useEffect, KeyboardEvent, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@emotion/css';

import useFixedBodyWhenHasClass from '../hooks/use-fixed-body-when-has-class';

export const hasModalClass = 'has-modal';
export const modalRootId = 'modal-root';
export const modalPortalId = 'modal-root-portal';

import type { RefDiv } from '../types';

interface Props {
  className: string;
  deactivate: () => void;
  isActive: boolean;
  ref?: RefDiv;
}

const Escape = 'Escape';

const ModalPortal = ({
  children,
  className,
  deactivate,
  isActive,
  ref,
}: PropsWithChildren<Props>) => {
  const target = document.getElementById(modalPortalId)!;

  const handleOverlayClick = (): void => {
    deactivate();
  };
  const handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === Escape && isActive) {
      deactivate();
    }
  };

  useEffect(() => {
    if (ref?.current) {
      ref.current.focus();
    }
  }, [ref]);

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
