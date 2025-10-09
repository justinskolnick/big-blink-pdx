const { Labels } = require('../../helpers/labels');

const labels = new Labels();
const prefix = 'param';

const getDeprecatedParamMessage = (param) => labels.getLabel('deprecated', prefix, { param });
const getInvalidValueMessage = (param, value) => labels.getLabel('value_invalid', prefix, { param, value });
const getOutOfRangeValueMessage = (param, value) => labels.getLabel('value_out_of_range', prefix, { param, value });

module.exports = {
  getDeprecatedParamMessage,
  getInvalidValueMessage,
  getOutOfRangeValueMessage,
};
