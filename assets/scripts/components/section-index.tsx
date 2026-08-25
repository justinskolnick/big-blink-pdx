import React, { Fragment, ReactNode } from 'react';
import { cx } from '@emotion/css';

import Filter, { Filters } from './filter';
import IndexListHeader from './index-list-header';
import Loading from './loading';
import Pagination from './pagination';
import { SortLink } from './links';

import useSelector from '../hooks/use-app-selector';

import { getLabels } from '../selectors';

import {
  SortByValues,
  SortValues,
  type Filters as FiltersType,
  type Id,
  type Ids,
  type Pagination as PaginationType,
  type RefTable,
} from '../types';

interface IndexProps {
  className?: string;
  children: ReactNode;
}

interface IntroductionContentProps {
  content?: string | TrustedHTML;
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
  filters?: FiltersType;
  introduction?: ReactNode;
  isLoading?: boolean;
  item?: (id: Id) => ReactNode;
  pagination?: PaginationType;
  pageIds?: Ids;
  ref?: RefTable;
  title?: string;
}

export const Index = ({ className, children }: IndexProps) => (
  <section className={cx('section-index', className)}>
    {children}
  </section>
);

export const IntroductionContent = ({ content }: IntroductionContentProps) => {
  if (!content) return null;

  return (
    <div
      className='introduction-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export const Introduction = ({ children }: IntroductionProps) => {
  const labels = useSelector(getLabels);

  return (
    <section
      className='section-index-introduction'
      id='section-introduction'
    >
      <h4>{labels.introduction}</h4>

      {children}
    </section>
  );
};

export const Content = ({ children, isLoading }: ContentProps) => (
  <div className='item-content'>
    {isLoading ? <Loading /> : children}
  </div>
);

const SectionIndex = ({
  children,
  className,
  filters,
  introduction,
  isLoading = true,
  item,
  pageIds,
  pagination,
  ref,
  title,
}: Props) => {
  const labels = useSelector(getLabels);

  const hasPageIds = (pageIds?.length ?? 0) > 0;
  let hasSearch = false;

  if (filters?.search) {
    hasSearch = filters.search.values !== undefined;
  }

  return (
    <Index className={className}>
      {introduction && (
        <Introduction>{introduction}</Introduction>
      )}

      <Content isLoading={isLoading}>
        {children || (
          <>
            <IndexListHeader title={title}
              subtitle={hasSearch
                ? labels.listAllResultsFilteredSearch
                : labels.listAllResults
              }
            >
              <Filters className='list-filters'>
                <Filter filter={filters?.search} />
              </Filters>
            </IndexListHeader>

            <table className='section-index-list index-list' cellPadding='0' cellSpacing='0' ref={ref}>
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
                {hasPageIds ? pageIds?.map((id: Id) => (
                  <Fragment key={id}>
                    {item?.(id)}
                  </Fragment>
                )) : (
                  <tr>
                    <td colSpan={4}>
                      {labels.listNoResults}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </Content>

      {hasPageIds && pagination && (
        <footer className='item-footer'>
          <Pagination pagination={pagination} />
        </footer>
      )}
    </Index>
  );
};

export default SectionIndex;
