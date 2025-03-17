const { PARAM_PAGE } = require('../config/constants');

const getPath = (...rest) => [...rest]
  .map(segment => {
    if (typeof segment === 'string' && segment.startsWith('/')) {
      return segment;
    }

    return '/' + segment;
  })
  .join('');

const links = {
  home: () => getPath('/'),
  entities: () => getPath('entities'),
  entity: id => getPath('entities', id),
  incidents: () => getPath('incidents'),
  incident: id => getPath('incidents', id),
  people: () => getPath('people'),
  person: id => getPath('people', id),
  sources: () => getPath('sources'),
  source: id => getPath('sources', id),
};

const toPageLink = (pathname, page, params = {}) => {
  const queryParams = new URLSearchParams(params);

  if (page > 1) {
    queryParams.set(PARAM_PAGE, page);
  }

  return {
    pathname,
    search: queryParams.toString(),
  };
};

const pagesToDisplayInPagination = 10;

const getPagination = (config) => {
  const { total, perPage, page, params, path } = config;

  const toPageObject = p => p === null ? null : ({
    label: p,
    link: toPageLink(path, p, params),
    value: p,
  });

  const pageValue = Number(page);
  const pageCount = Math.ceil(total / perPage);
  const pageNumbers = [...Array(pageCount)].map((n,i) => i + 1);
  const currentIndex = pageNumbers.indexOf(pageValue);
  const adjustedPageNumbers = [];
  let lower;
  let upper;

  if (pagesToDisplayInPagination > pageValue) {
    lower = 1;
    upper = pageCount >= pagesToDisplayInPagination ? pagesToDisplayInPagination : pageCount;
  } else if ((pagesToDisplayInPagination - 1) > (pageCount - pageValue)) {
    lower = pageCount - (pagesToDisplayInPagination - 1);
    upper = pageCount;
  } else {
    lower = pageValue - 1;
    upper = pageValue + (pagesToDisplayInPagination - 2);
  }

  if (lower > 1) {
    adjustedPageNumbers.push(1, null);
  }

  for (let i = lower; i < upper + 1; i++ ) {
    adjustedPageNumbers.push(i);
  }

  return {
    total,
    page: pageValue,
    pageCount,
    pages: {
      numbered: adjustedPageNumbers.map(toPageObject),
      next: pageCount === 1 || pageValue === pageNumbers.at(-1)
        ? null
        : toPageObject(pageNumbers.at(currentIndex + 1)),
      previous: pageCount === 1 || pageValue === 1
        ? null
        : toPageObject(pageNumbers.at(currentIndex - 1)),
      last: toPageObject(pageNumbers.at(-1)),
    },
  };
};

module.exports = {
  links,
  getPagination,
};
