import React, { ReactNode } from 'react';
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
}: Props) => (
  <CSSTransition
    timeout={250}
    classNames='modal'
    in={isActive}
    unmountOnExit
  >
    <ModalPortal
      className={className}
      deactivate={deactivate}
      isActive={isActive}
    >
      {children}
    </ModalPortal>
  </CSSTransition>
);

export default Modal;
