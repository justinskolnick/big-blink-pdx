import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx, css } from '@emotion/css';

import SectionHeader from './section-header';

const styles = css`
  .section-header {
    display: flex;
    align-items: flex-start;

    .section-header-eyes {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 0;
      flex-shrink: 0;
      margin-top: calc(var(--gap) / 4);
      margin-right: calc(var(--gap) * -1);
      width: var(--section-header-eyes-size);
      height: var(--section-header-eyes-size);
      border-radius: 50%;
      background-color: var(--color-accent-lightest);
      color: var(--color-accent-darker);
      font-size: 8px;
      z-index: 1;

      .eyes {
        flex-grow: 0;
        flex-shrink: 0;
        width: 36px;
        height: 11px;
        gap: 1.5px;
      }

      .icon {
        width: 11px;
        height: 11px;
      }

      &:hover {
        .icon {
          animation: blink 500ms;
        }
      }
    }

    .section-header-icon {
      position: relative;
      width: var(--section-header-icon-size);
      height: var(--section-header-icon-size);
      border-radius: 50%;
      background-color: var(--color-header-icon);
      box-shadow: 0px 1px 3px var(--color-gray);
      z-index: 2;

      &.has-link {
        background-color: var(--color-header-icon-link);
        transition: width 250ms ease-in-out,
                    height 250ms ease-in-out;

        .icon {
          transition: width 250ms ease-in-out,
                      height 250ms ease-in-out;
        }
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--section-header-icon-size);
        height: var(--section-header-icon-size);
        color: var(--color-white);

        &.has-link {
          transition: width 250ms ease-in-out,
                      height 250ms ease-in-out;
        }

        svg {
          font-size: calc(var(--section-header-icon-size) / 9 * 4);
        }
      }
    }

    .section-header-title {
      margin: calc(var(--gap) / 3 * 2) 0;

      h2 {
        font-family: 'Darumadrop One';
        text-transform: uppercase;
      }
    }

    .section-icon {
      display: block;
    }

    &.has-subheader {
      h2 {
        font-weight: 600;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0.5px;
        text-transform: uppercase;

        a {
          color: var(--color-header-accent);
        }
      }

      h3 {
        font-size: 32px;
        line-height: 36px;

        a {
          color: var(--color-black);
        }
      }

      h4 {
        font-weight: 200;
        font-size: 14px;
        line-height: 18px;
      }

      h3 + h4 {
        margin-top: 3px;
      }

      .section-header-detail + .section-header-detail {
        &::before {
          content: '·';
          margin-left: calc(var(--gap) / 2);
          margin-right: calc(var(--gap) / 2);
        }
      }
    }

    & + .section-index,
    & + .item-detail {
      margin-top: 36px;
    }
  }

  .section-header + .section-main {
    margin-top: calc(2 * var(--gap));
  }

  @media screen and (min-width: 613px) {
    --section-header-eyes-size: var(--section-header-eyes-size-large);
    --section-header-icon-size: var(--section-header-icon-size-large);

    .section-header {
      &.has-subheader {
        .section-header-title {
          margin-top: calc(var(--gap) / 6);
          margin-bottom: calc(var(--gap) / 6);
        }
      }

      .section-header-icon {
        &.has-link {
          .icon {
            transition: transform 1s ease-in-out;
          }

          &:hover {
            .icon {
              transform: rotate(720deg) scale(1.5);
            }
          }
        }
      }

      .section-header-icon + .section-header-title {
        margin-left: var(--section-header-icon-space-after);
      }
    }
  }

  @media screen and (max-width: 612px) {
    --section-header-eyes-size: var(--section-header-eyes-size-small);
    --section-header-icon-size: var(--section-header-icon-size-small);

    .section-header {
      align-items: center;
      flex-direction: column;

      &.has-subheader {
        align-items: center;
      }

      .section-header-title {
        text-align: center;
      }

      .section-header-eyes {
        display: none;
      }

      .section-header-icon + .section-header-title {
        margin-top: var(--section-header-icon-space-after);
      }
    }
  }

  @media screen and (max-width: 600px) {
    padding-left: var(--layout-margin);
    padding-right: var(--layout-margin);
  }
`;

interface Props {
  children: ReactNode;
  className?: string;
  icon?: IconName;
  title?: ReactNode | string;
}

const Section = ({
  children,
  className,
  icon,
  title,
}: Props) => (
  <section className={cx('section', styles, className)}>
    <SectionHeader title={title} icon={icon} />

    <section className='section-main'>
      {children}
    </section>
  </section>
);

export default Section;
