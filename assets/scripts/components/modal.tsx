import React, { useRef, ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

import ModalPortal from './modal-portal';

interface Props {
  children: ReactNode;
  className: string;
  deactivate: () => void;
  isActive: boolean;
}

const Modal = ({
  children,
  className,
  deactivate,
  isActive
}: Props) => {
  const ref = useRef(null);

  return (
    <CSSTransition
      timeout={250}
      classNames='modal'
      in={isActive}
      nodeRef={ref}
      unmountOnExit
    >
      <ModalPortal
        className={className}
        deactivate={deactivate}
        isActive={isActive}
        ref={ref}
      >
        {children}
      </ModalPortal>
    </CSSTransition>
  );
};

export default Modal;
