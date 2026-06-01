import React, { useEffect, useRef, MouseEvent } from 'react';

import ItemTextWithIcon from './item-text-with-icon';

import { unique } from '../lib/array';

import type { AlertType, RefDialogElement } from '../types';

interface MessageContentProps {
  alert: AlertType;
}

interface MessageProps {
  alert: AlertType;
}

interface CustomMessageProps {
  alert: AlertType;
}

interface AlertProps {
  alerts: AlertType[];
  deactivate: () => void;
  grade: 'error' | 'message' | 'warning';
  isActive: boolean;
}

const isObject = (alert: AlertType) => typeof alert === 'object';
const getHasMessage = (alert: AlertType) => isObject(alert) && Boolean(alert.message);
const getHasStatus = (alert: AlertType) => isObject(alert) && Boolean(alert.status);

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

const Message = ({ alert }: MessageProps) => (
  <p className='message-content'>
    <MessageContent alert={alert} />
  </p>
);

const CustomMessage = ({ alert }: CustomMessageProps) => (
  <>
    {alert.customMessage && (
      <p
        className='message-content'
        dangerouslySetInnerHTML={{ __html: alert.customMessage }}
      />
    )}
    <p className='original-message-content'>
      (<MessageContent alert={alert} />)
    </p>
  </>
);

const AlertMessageContent = ({ alert }: MessageContentProps) =>
  alert.customMessage === alert.message ? (
    <Message alert={alert} />
  ) : (
    <CustomMessage alert={alert} />
  );

const Alert = ({
  alerts,
  deactivate,
  grade,
  isActive,
}: AlertProps) => {
  const ref = useRef<RefDialogElement>(null);

  const iconName = ['error', 'warning'].includes(grade) ? 'triangle-exclamation' : 'asterisk';
  const classNames = unique(['alert-message', `alert-${grade}`]).join(' ');

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (e.target instanceof HTMLElement) {
      if (e.target.tagName !== 'A') {
        deactivate();
        ref?.current?.close();
      }
    }
  };

  useEffect(() => {
    if (isActive) {
      ref?.current?.showModal();
    }
  }, [ref, isActive]);

  return (
    <dialog className='alert' onClick={handleClick} ref={ref}>
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
    </dialog>
  );
};

export default Alert;
