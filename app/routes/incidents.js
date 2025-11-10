const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const { SECTION_INCIDENTS } = require('../config/constants');

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');

const incidents = require('../services/incidents');

const title = 'Incidents';
const template = 'main';
const slug = SECTION_INCIDENTS;
const section = {
  slug,
  title,
};

router.get('/', (req, res) => {
  const description = metaHelper.getIndexDescription();

  section.id = null;
  section.subtitle = null;

  const meta = metaHelper.getMeta(req, {
    description,
    section,
  });

  res.render(template, { title, meta, robots: headers.robots });
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const description = metaHelper.getDetailDescription();

  let result;

  try {
    result = await incidents.getAtId(id);
  } catch (err) {
    console.error('Error while getting incident:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (result.exists) {
    adapted = result.adapted;

    section.id = adapted.id;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  const meta = metaHelper.getMeta(req, {
    description,
    section,
  });

  res.render(template, { title, meta, robots: headers.robots });
});

module.exports = router;
