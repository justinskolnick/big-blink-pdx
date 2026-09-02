const {
  PARAM_SEARCH,
} = require('../../config/constants');

const {
  getLabel,
  getLabelText,
  getLabelLink,
} = require('./filters');
const {
  getSearch,
} = require('../request/search-params');

const LABEL_PREFIX = 'filter';

const getSearchFilter = (searchParams, options = {}) => {
  const hasSearchParam = searchParams.has(PARAM_SEARCH);

  const fields = {
    'search-input': [
      getLabelText('show_results_matching', LABEL_PREFIX),
      {
        name: PARAM_SEARCH,
        type: 'input-search',
      },
    ],
  };

  if (hasSearchParam) {
    const param = searchParams.get(PARAM_SEARCH);
    const search = getSearch(param);

    if (search) {
      return {
        fields,
        id: options.search.id,
        labels: [
          getLabelText('showing_results_matching', LABEL_PREFIX),
          getLabel(search),
        ],
        model: null,
        values: {
          [PARAM_SEARCH]: param,
        },
      };
    }
  }

  return {
    fields,
    id: options.search.id,
    labels: [
      getLabelText('filter_this_list_by', LABEL_PREFIX),
      getLabelLink('search-input', null, 'search_term', LABEL_PREFIX),
    ],
    model: null,
  };
};

const getFilters = (searchParams, options = {}) => ({
  search: getSearchFilter(searchParams, options),
});

module.exports = {
  getFilters,
};
