const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const { SECTION_SOURCES } = require('../config/constants');

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');

const sources = require('../services/sources');

const title = 'Data Sources';
const template = 'main';
const slug = SECTION_SOURCES;
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

  let source;
  let adapted;
  let description = metaHelper.getDetailDescription();

  try {
    source = await sources.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (source.exists) {
    adapted = source.adapted;

    description = metaHelper.getDetailDescription(adapted.title, 'from');
    section.id = adapted.id;
    section.subtitle = adapted.title;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  const meta = metaHelper.getMeta(req, { description });

  res.render(template, { title, meta, robots: headers.robots });
});

module.exports = router;
