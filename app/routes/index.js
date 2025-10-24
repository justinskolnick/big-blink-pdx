const express = require('express');
const router = express.Router();

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');

const title = 'Remixing lobbying data published by the City of Portland, Oregon';
const template = 'main';
const section = {};

router.get('/', (req, res) => {
  const description = metaHelper.getIndexDescription();
  const meta = metaHelper.getMeta(req, {
    description,
    pageTitle: title,
    section,
  });

  res.render(template, { title, meta, robots: headers.robots });
});

module.exports = router;
