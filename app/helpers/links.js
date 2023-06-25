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
    queryParams.set('page', page);
  }

  return {
    pathname,
    search: queryParams.toString(),
  };
};

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
  const lastIndex = pageNumbers.indexOf(pageNumbers.at(-1));
  let adjustedPageNumbers = [];

  if (pageCount > 10) {
    if (pageValue > 10) {
      adjustedPageNumbers.push(pageNumbers.at(0));
      adjustedPageNumbers.push(null);

      if (pageCount - currentIndex > 10) {
        adjustedPageNumbers = [].concat(
          adjustedPageNumbers,
          pageNumbers.slice(currentIndex - 1, currentIndex + 9)
        );
        adjustedPageNumbers.push(null);
        adjustedPageNumbers.push(pageNumbers.at(-1));
      } else {
        adjustedPageNumbers = [].concat(
          adjustedPageNumbers,
          pageNumbers.slice(lastIndex - 9, lastIndex + 1)
        );
      }
    } else {
      adjustedPageNumbers = [].concat(
        adjustedPageNumbers,
        pageNumbers.slice(0, 10)
      );
    }
  } else {
    adjustedPageNumbers = pageNumbers;
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
