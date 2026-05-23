import React, { Fragment, ReactNode } from 'react';
import { cx } from '@emotion/css';

import Loading from './loading';
import Pagination from './pagination';
import { SortLink } from './links';

import useSelector from '../hooks/use-app-selector';

import { getLabels } from '../selectors';

import {
  SortByValues,
  SortValues,
  type Id,
  type Ids,
  type Pagination as PaginationType,
  type RefTable,
} from '../types';

interface IndexProps {
  className?: string;
  children: ReactNode;
}

interface IntroductionProps {
  children: ReactNode;
}

interface ContentProps {
  children: ReactNode;
  isLoading?: boolean;
}

interface Props {
  children?: ReactNode;
  className?: string;
  introduction?: ReactNode;
  isLoading?: boolean;
  item?: (id: Id) => ReactNode;
  pagination?: PaginationType;
  pageIds?: Ids;
  ref?: RefTable;
}

export const Index = ({ className, children }: IndexProps) => (
  <section className={cx('section-index', className)}>
    {children}
  </section>
);

export const Introduction = ({ children }: IntroductionProps) => (
  <section
    className='section-index-introduction'
    id='section-introduction'
  >
    <h4>Introduction</h4>

    {children}
  </section>
);

export const Content = ({ children, isLoading }: ContentProps) => (
  <div className='item-content'>
    {isLoading ? <Loading /> : children}
  </div>
);

const SectionIndex = ({
  children,
  className,
  introduction,
  isLoading = true,
  item,
  pageIds,
  pagination,
  ref,
}: Props) => {
  const labels = useSelector(getLabels);

  return (
    <Index className={className}>
      {introduction && (
        <Introduction>{introduction}</Introduction>
      )}

      <Content isLoading={isLoading}>
        {children || (
          <table className='section-index-list' cellPadding='0' cellSpacing='0' ref={ref}>
            <thead>
              <tr>
                <th className='cell-name' colSpan={2}>
                  <SortLink
                    defaultSort={SortValues.ASC}
                    isDefault
                    name={SortByValues.Name}
                    title={labels.sortListByName}
                  >
                    Name
                  </SortLink>
                </th>
                <th className='cell-total'>
                  <SortLink
                    defaultSort={SortValues.DESC}
                    name={SortByValues.Total}
                    title={labels.sortListByTitle}
                  >
                    Total
                  </SortLink>
                </th>
                <th className='cell-percent'>%</th>
              </tr>
            </thead>
            <tbody>
              {pageIds?.map((id: Id) => (
                <Fragment key={id}>
                  {item?.(id)}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </Content>

      {pagination && (
        <footer className='item-footer'>
          <Pagination pagination={pagination} />
        </footer>
      )}
    </Index>
  );
};

export default SectionIndex;
