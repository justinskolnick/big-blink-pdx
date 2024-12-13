import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import AlertPortal from './alert-portal';
import ItemTextWithIcon from './item-text-with-icon';

import { unique } from '../lib/array';

import type { AlertType } from '../types';

interface MessageContentProps {
  alert: AlertType;
}

interface AlertProps {
  alerts: AlertType[];
  deactivate: () => void;
  grade: 'error' | 'message' | 'warning';
  isActive: boolean;
}

const isObject = (alert: AlertType) => typeof alert === 'object';
const getHasCustomMessage = (alert: AlertType) => isObject && Boolean(alert.customMessage);
const getHasMessage = (alert: AlertType) => isObject && Boolean(alert.message);
const getHasStatus = (alert: AlertType) => isObject && Boolean(alert.status);

const MessageContent = ({ alert }: MessageContentProps) => {
  const hasMessage = getHasMessage(alert);
  const hasStatus = getHasStatus(alert);

  return (
    <>
      {hasStatus && <strong>{alert.status}</strong>}
      {hasStatus && hasMessage && ' '}
      {hasMessage && <span dangerouslySetInnerHTML={{ __html: alert.message }} />}
      {!hasStatus && !hasMessage && <span>Something went wrong</span>}
    </>
  );
};

const AlertMessageContent = ({ alert }: MessageContentProps) => {
  const hasCustomMessage = getHasCustomMessage(alert);

  return hasCustomMessage ? (
    <>
      <p
        className='message-content'
        dangerouslySetInnerHTML={{ __html: alert.customMessage }}
      />
      <p className='original-message-content'>
        (<MessageContent alert={alert} />)
      </p>
    </>
  ) : (
    <p className='message-content'>
      <MessageContent alert={alert} />
    </p>
  );
};

const Alert = ({
  alerts,
  deactivate,
  grade,
  isActive,
}: AlertProps) => {
  const ref = useRef<HTMLDivElement>();

  const iconName = ['error', 'warning'].includes(grade) ? 'triangle-exclamation' : 'asterisk';
  const classNames = unique(['alert-message', `alert-${grade}`]).join(' ');

  return (
    <CSSTransition
      timeout={250}
      classNames='alert'
      in={isActive}
      nodeRef={ref}
      unmountOnExit
    >
      <AlertPortal
        deactivate={deactivate}
        isActive={isActive}
        ref={ref}
      >
        <section className={classNames}>
          <header className='alert-header'>
            <h4>
              <ItemTextWithIcon icon={iconName}>
                {grade === 'error' && 'Error'}
                {grade === 'message' && 'Message'}
                {grade === 'warning' && 'Warning'}
              </ItemTextWithIcon>
            </h4>
          </header>

          <main className='alert-main'>
            {alerts.map((alert, i) => (
              <AlertMessageContent key={i} alert={alert} />
            ))}
          </main>

          <footer className='alert-footer'>
            Click anywhere to exit.
          </footer>
        </section>
      </AlertPortal>
    </CSSTransition>
  );
};

export default Alert;
