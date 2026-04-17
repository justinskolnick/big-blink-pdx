const express = require('express');
const router = express.Router();

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');
const Meta = require('../lib/route/meta');

const title = 'Remixing lobbying data published by the City of Portland, Oregon';
const template = 'main';

router.get('/', (req, res) => {
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
