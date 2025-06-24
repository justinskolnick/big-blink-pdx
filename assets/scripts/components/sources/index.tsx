import React, { useRef, MouseEvent, ReactNode } from 'react';
import { useSelector } from 'react-redux';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';

import { scrollToTop } from '../../lib/dom';

import ItemSubhead from '../item-subhead';
import {
  Content,
  Index as SectionIndex,
  Introduction,
} from '../section-index';
import Source from './item';

import {
  getSourcesByType,
  getSourceTypes,
} from '../../selectors';

import type {
  SourcesByType,
  SourcesByYear,
} from '../../types';
import { Fn } from '../../types';

type SourceTypeKey = SourcesByType['type'];

interface SourceTypeYearProps {
  year: SourcesByYear;
}

interface SourceTypeProps {
  children: ReactNode;
  handleScroll: Fn;
  ref: (node: HTMLDivElement) => () => void;
  type: SourcesByType;
}

interface TypeAnchorLinkProps {
  handleScroll: Fn;
  typeKey: string;
}

interface SourcesProps {
  isLoading: boolean;
  types: SourcesByType[];
}

const useTypeLabel = (type: SourceTypeKey) => {
  const types = useSelector(getSourceTypes);
  const label = types[type].label;

  return label;
};

const SourceTypeYear = ({ year }: SourceTypeYearProps) => (
  <div key={year.year} className='item-index-subgroup'>
    <ItemSubhead subtitle={year.year} />

    <div className='item-index-group-grid'>
      {year.items.map(source => (
        <Source key={source.id} id={source.id} />
      ))}
    </div>
  </div>
);

const SourceType = ({ children, handleScroll, ref, type }: SourceTypeProps) => {
  const label = useTypeLabel(type.type);

  return (
    <div className='item-index-group' id={type.type} ref={ref}>
      <ItemSubhead title={label}>
        <p>
          <a
            href='#section-introduction'
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();

              handleScroll();
            }}
          >
            Back to top
          </a>
        </p>
      </ItemSubhead>
      {children}
    </div>
  );
};

const TypeAnchorLink = ({ handleScroll, typeKey }: TypeAnchorLinkProps) => {
  const label = useTypeLabel(typeKey);

  return (
    <a
      href={`#${typeKey}`}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        handleScroll();
      }}
    >
      {label}
    </a>
  );
};

// https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
const Sources = ({ isLoading, types }: SourcesProps) => {
  const refs = useRef<Map<SourceTypeKey, HTMLDivElement>>(null);

  const keys = types.map(type => type.type);

  const scrollToList = (type: SourceTypeKey) => {
    const map = getMap();
    const node = map.get(type);

    node.scrollIntoView({ behavior: 'smooth' });
  };

  const getMap = () => {
    if (!refs.current) {
      refs.current = new Map();
    }

    return refs.current;
  };

  return (
    <>
      <Introduction>
        <p>The sources of the data used on this site are grouped by type below.</p>

        <ul>
          {keys.map((key) => (
            <li key={key}>
              <TypeAnchorLink
                handleScroll={() => scrollToList(key)}
                typeKey={key}
              />
            </li>
          ))}
        </ul>
      </Introduction>

      <Content isLoading={isLoading}>
        {types.map((type) => (
          <SourceType
            key={type.type}
            handleScroll={scrollToTop}
            ref={(node: HTMLDivElement) => {
              const map = getMap();

              map.set(type.type, node);

              return () => {
                map.delete(type.type);
              };
            }}
            type={type}
          >
            {Object.values(type.years).map(year => (
              <SourceTypeYear key={year.year} year={year} />
            ))}
          </SourceType>
        ))}
      </Content>
    </>
  );
};

const Index = () => {
  const byType = useSelector(getSourcesByType);

  const hasSources = byType.length > 0;

  useFetchAndScrollOnRouteChange();

  return (
    <SectionIndex>
      {hasSources && <Sources isLoading={!hasSources} types={byType} />}
    </SectionIndex>
  );
};

export default Index;
