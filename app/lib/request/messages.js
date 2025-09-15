const Labels = require('../../models/shared/labels');
const labelsModel = new Labels();

const prefix = 'param';

const getDeprecatedParamMessage = (param) => labelsModel.getLabel('deprecated', prefix, { param });
const getInvalidValueMessage = (param, value) => labelsModel.getLabel('value_invalid', prefix, { param, value });
const getOutOfRangeValueMessage = (param, value) => labelsModel.getLabel('value_out_of_range', prefix, { param, value });

module.exports = {
  getDeprecatedParamMessage,
  getInvalidValueMessage,
  getOutOfRangeValueMessage,
};
