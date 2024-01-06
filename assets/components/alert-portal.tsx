import React, { useEffect, useRef, KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx, css } from '@emotion/css';

import useFixedBodyWhenHasClass from '../hooks/use-fixed-body-when-has-class';

export const hasAlertClass = 'has-alert' as const;
export const alertRootId = 'alert-root' as const;
export const alertPortalId = 'alert-root-portal' as const;

const styles = css`
  .alert-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  .alert-content {
    position: absolute;
  }

  cursor: pointer;

  .alert-overlay {
    overflow: hidden;
  }

  .alert-content {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .alert-message {
    --alert-header-icon-color-error: var(--color-danger);
    --alert-header-icon-color-warning: var(--color-warning);
    --alert-header-icon-color-message: var(--color-accent-alt-lighter);
    --alert-header-icon-color: var(--alert-header-icon-color-message);
    --alert-header-icon-size: 36px;
    --alert-space-size: 18px;

    box-sizing: border-box;
    margin: var(--gap);
    padding: var(--gap);
    max-width: 400px;
    border-radius: 18px;
    background-color: var(--color-background);
    box-shadow: 0 4px 9px var(--color-gray);
    opacity: 0;
    transform: scale(0.75);
    transition: opacity 250ms ease-in-out,
                transform 250ms ease-in-out;

    .alert-header + .alert-main {
      margin-top: 18px;
    }

    .alert-main + .alert-footer {
      margin-top: 36px;
    }

    .alert-footer {
      color: var(--color-light);
      font-size: 12px;
    }

    h4 {
      .item-text-with-icon {
        align-items: center;

        .icon + .item-text {
          margin-left: 1ch;
        }
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--alert-header-icon-size);
        height: var(--alert-header-icon-size);
        border-radius: 50%;
        background-color: var(--alert-header-icon-color);
        color: var(--color-white);

        svg {
          font-size: calc(var(--alert-header-icon-size) / 9 * 4);
        }
      }
    }

    &.alert-error {
      --alert-header-icon-color: var(--alert-header-icon-color-error);
    }

    &.alert-warning {
      --alert-header-icon-color: var(--alert-header-icon-color-warning);
    }

    p {
      line-height: 24px;

      &.message-content {
        font-size: 18px;
      }

      &.original-message-content {
        color: var(--color-text-lighter);
        font-size: 10px;
      }
    }

    p + p {
      margin-top: 9px;
    }

    code {
      font-family: monospace;
    }

    .alert-footer {
      .item-text-with-icon {
        align-items: center;
      }

      .item-text {
        font-weight: 600;
        font-size: 14px;
      }
    }
  }

  &[class*="alert-enter"] {
    .alert-message {
      opacity: 1;
      transform: scale(1);

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
`;

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
      className={cx('alert', styles)}
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
