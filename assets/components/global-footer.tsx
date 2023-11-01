import React from 'react';
import { cx, css } from '@emotion/css';

import Eyes from './eyes';
import { GlobalLink, LinkToSources } from './links';

const styles = css`
  color: var(--color-text-lighter);

  .global-footer-navigation {
    .global-footer-navigation-title {
      a {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: none;
        color: var(--color-black);
        white-space: nowrap;
      }

      .eyes {
        width: 52px;
        height: 16px;
        gap: 2px;

        .icon {
          width: 16px;
          height: 16px;
        }

        &:hover {
          .icon {
            animation: blink 500ms;
          }
        }
      }

      h6 {
        font-weight: 600;
        font-size: 16px;
        line-height: 27px;
      }

      .eyes + h6 {
        margin-left: calc(var(--gap) / 2);
      }
    }

    ul {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 14px;
      line-height: 27px;
    }

    li {
      white-space: nowrap;

      &:not(:last-child) {
        &::after {
          content: '·';
          margin-left: calc(var(--gap) / 2);
          margin-right: calc(var(--gap) / 2);
        }
      }
    }
  }

  .global-footer-navigation + .global-footer-content {
    margin-top: calc(var(--gap) * 2);
  }

  h6,
  p {
    display: inline;
    font-size: 12px;
    line-height: 18px;
  }

  p + h6 {
    &::before {
      content: ' // ';
      font-weight: 400;
    }
  }

  h6 + p {
    &::before {
      content: ': ';
      font-weight: 600;
    }
  }

  p + p {
    &::before {
      content: ' ';
    }
  }

  a {
    color: var(--color-link);
  }

  @media screen and (max-width: 600px) {
    padding-left: var(--layout-margin);
    padding-right: var(--layout-margin);

    .global-footer-navigation {
      .global-footer-navigation-title + .global-footer-navigation-links {
        margin-top: calc(var(--gap) / 2);
      }
    }
  }

  @media screen and (min-width: 601px) {
    .global-footer-navigation {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .global-footer-navigation-title + .global-footer-navigation-links {
        margin-left: calc(var(--gap) * 2);
      }
    }
  }
`;

const GlobalFooter = () => (
  <footer className={cx('global-footer', styles)}>
    <nav className='global-footer-navigation' aria-label='Global Navigation'>
      <div className='global-footer-navigation-title'>
        <GlobalLink to='/'>
          <Eyes />
          <h6>The Big Blink</h6>
        </GlobalLink>
      </div>

      <ul className='global-footer-navigation-links'>
        <li><GlobalLink to='/incidents'>Incidents</GlobalLink></li>
        <li><GlobalLink to='/entities'>Entities</GlobalLink></li>
        <li><GlobalLink to='/people'>People</GlobalLink></li>
        <li><GlobalLink to='/sources'>Data Sources</GlobalLink></li>
      </ul>
    </nav>

    <section className='global-footer-content'>
      <h6>About</h6>
      <p>
        This website (“site”) was developed using <LinkToSources>data published by the City of Portland</LinkToSources> (“City”). Good effort was made to represent City data with accuracy and completeness, though unintentional errors and omissions may have occurred during the import process. In the event a discrepancy is found to exist between the data represented on this site and the data published on the City of Portland’s website, <a href='mailto:help@bigblinkpdx.org'>please reach out</a>. Data on the City’s site is to be considered for all purposes official, accurate, and complete.
      </p>

      <h6>License</h6>
      <p>
        Copyright &copy; 2023 by <a href='https://justinskolnick.com'>Justin Skolnick</a>.
      </p>
      <p>
        The code for this site is <a href='https://en.wikipedia.org/wiki/Open-source_software'>open source</a>. <a href='https://github.com/justinskolnick/big-blink-pdx'>Contribute to its development on Github</a>.
      </p>

      <h6>Privacy Policy</h6>
      <p>
        This site is not configured to identify you or collect personal data from you, although your device’s <a href='https://en.wikipedia.org/wiki/IP_address'>IP address</a>, <a href='https://en.wikipedia.org/wiki/User_agent'>user agent</a>, and time of access may be incidentally logged by the web server that publishes this site. Third-party software installed to provide site services (potentially including but not limited to: user interface features, performance monitoring, and/or error reporting) may be found to collect and store data about you and/or your device; no responsibility is assumed for the operation and/or data-handling processes and/or practices of third-party software and/or services.
      </p>

      <h6>Media Inquiries</h6>
      <p>Contact information for current City officials may be found on the City’s website — follow your hunches!</p>

      <h6>Accessibility</h6>
      <p>Making this site accessible to users of all abilities is a sincere aspiration and is always a work in progress.</p>
    </section>
  </footer>
);

export default GlobalFooter;
