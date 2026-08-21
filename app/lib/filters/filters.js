const { Labels } = require('../../helpers/labels');

const LABEL_PREFIX = 'filter';

const labels = new Labels();

const getLabel = value => ({
  type: 'label',
  value,
});

const getLabelText = (key, prefix = LABEL_PREFIX) => ({
  type: 'text',
  value: labels.getLabel(key, prefix),
});

const getLabelLink = (action, to, key, prefix = LABEL_PREFIX) => ({
  action,
  to,
  type: 'link',
  value: labels.getLabel(key, prefix),
});

const getLabelId = value => ({
  type: 'id',
  value: Number(value),
});

module.exports = {
  getLabel,
  getLabelText,
  getLabelLink,
  getLabelId,
};
