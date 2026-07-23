const express = require('express');
const router = express.Router();

const { Labels } = require('../helpers/labels');
const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');
const Meta = require('../lib/route/meta');

const template = 'main';

const labels = new Labels();

router.get('/', (req, res) => {
  const title = labels.getLabel('title', 'global');

  const meta = new Meta(req);

  meta.setOtherValues({
    description: metaHelper.getIndexDescription(),
  });
  meta.setCustomPageTitle(title);

  res.render(template, {
    title,
    meta: meta.toObject(),
    robots: headers.robots,
  });
});

module.exports = router;
