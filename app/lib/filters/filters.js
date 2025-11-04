const getLabel = value => ({
  type: 'label',
  value,
});

const getLabelText = value => ({
  type: 'text',
  value,
});

const getLabelLink = (action, to, value) => ({
  action,
  to,
  type: 'link',
  value,
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
