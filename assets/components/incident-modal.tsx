import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { css } from '@emotion/css';

import fetchFromPath from '../lib/fetch-from-path';
import { RootState } from '../lib/store';
import { selectors } from '../reducers/incidents';

import IncidentStatGroup from './incident-stat-group';
import IncidentTable from './incident-table';
import ItemTextWithIcon from './item-text-with-icon';
import { LinkToIncident } from './links';
import Modal from './modal';
import StatBox from './stat-box';

import type { Id } from '../types';

const styles = css`
  .modal-overlay {
    background-color: rgba(var(--color-blue-rgb), 0);
    overflow: hidden;
    transition: background-color 250ms ease-in-out;
  }

  .modal-content {
    top: 54px;
    right: 0;
  }

  .modal-incident {
    --modal-incident-max-width: 500px;
    --modal-incident-min-width: 400px;
    --incident-header-icon-size: 36px;
    --incident-space-size: 18px;

    overflow: hidden;
    max-width: var(--modal-incident-max-width);
    min-width: var(--modal-incident-min-width);
    box-sizing: border-box;
    box-shadow: 3px 4px 9px var(--color-blue);
    background-color: var(--color-background);
    transform: translateX(var(--modal-incident-max-width));
    transition: transform 250ms ease-in-out;

    .incident-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: var(--incident-space-size);
      background: linear-gradient(rgba(var(--color-background-rgb), 1) 50%, rgba(var(--color-background-rgb), 0) 100%);
    }

    .incident-main {
      padding: 72px var(--incident-space-size) calc(53px + var(--gap)) var(--incident-space-size);
      height: calc(100% - 72px - 53px - 36px);
      overflow: auto;
    }

    .incident-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: var(--incident-space-size);
      background-color: var(--color-lighter);
    }

    h4 {
      .item-text-with-icon {
        align-items: center;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--incident-header-icon-size);
        height: var(--incident-header-icon-size);
        border-radius: 50%;
        background-color: var(--color-header-icon);
        color: var(--color-white);

        svg {
          font-size: calc(var(--incident-header-icon-size) / 9 * 4);
        }
      }
    }

    .incident-table + .activity-stat-group {
      margin-top: 18px;
    }

    .incident-footer {
      .item-text-with-icon {
        align-items: center;

        .icon + .item-text {
          margin-left: 1ch;
        }
      }

      .item-text {
        font-weight: 600;
        font-size: 14px;
      }
    }
  }

  &.modal-appear,
  &.modal-enter,
  &.modal-exit {
    .modal-incident {
      position: relative;
      top: 0;
      bottom: 0;
      overflow: auto;
      height: 100%;
    }
  }

  &[class*="modal-enter"] {
    .modal-overlay {
      background-color: rgba(var(--color-blue-rgb), 0.75);
    }

    .modal-incident {
      transform: translateX(0);
    }
  }

  @media screen and (max-width: 600px) {
    .modal-content {
      top: 36px;
      left: 0;
      max-height: calc(100vh - 36px);
    }

    .modal-incident {
      --modal-incident-max-width: 100%;
      --modal-incident-min-width: 100%;
    }
  }

  @media screen and (max-height: 420px) {
    .modal-content {
      top: 36px;
      bottom: 36px;
      max-height: calc(100vh - 36px);
    }

    .modal-incident {
      height: 100%;
    }
  }

  @media screen and (max-height: 780px) {
    .modal-content {
      top: 36px;
    }
  }

  @media screen and (min-width: 601px) {
    .modal-incident {
      border-top-left-radius: var(--incident-space-size);
      border-bottom-left-radius: var(--incident-space-size);
    }
  }
`;

interface Props {
  deactivate: () => void;
  id: Id;
  isActive: boolean;
}

const IncidentModal = ({ deactivate, id, isActive }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const incident = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasIncident = Boolean(incident && 'attendees' in incident);
  const hasNotes = Boolean(incident?.notes);

  useEffect(() => {
    if (hasIncident) return;

    if (!fetched.current) {
      fetchFromPath('/incidents/' + id);
      fetched.current = true;
    }
  }, [fetched, location, hasIncident, id]);

  if (!incident) return null;

  return (
    <Modal className={styles} deactivate={deactivate} isActive={isActive}>
      <section className='modal-incident'>
        <header className='incident-header'>
          <h4>
            <ItemTextWithIcon icon='handshake'>
              Lobbying Incident
            </ItemTextWithIcon>
          </h4>
        </header>

        <main className='incident-main'>
          <IncidentTable incident={incident} />

          {hasNotes && (
            <IncidentStatGroup className={css`
              padding: 18px;
              border-radius: 9px;
              background-color: var(--color-off-white);

              .activity-stat {
                &.has-icon {
                  align-items: flex-start;
                }
              }

              .activity-stat-value {
                font-size: 13px;
                line-height: 18px;
              }
            `}>
              <StatBox title='Notes regarding this incident' icon='asterisk'>
                {incident.notes || 'None'}
              </StatBox>
            </IncidentStatGroup>
          )}
        </main>

        <footer className='incident-footer'>
          <ItemTextWithIcon icon='link'>
            <LinkToIncident id={incident.id}>
              View the full record
            </LinkToIncident>
          </ItemTextWithIcon>
        </footer>
      </section>
    </Modal>
  );
};

export default IncidentModal;
