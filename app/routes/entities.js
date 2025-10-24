const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const { SECTION_ENTITIES } = require('../config/constants');

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');

const entities = require('../services/entities');

const title = 'Entities';
const template = 'main';
const slug = SECTION_ENTITIES;
const section = {
  slug,
  title,
};

router.get('/', (req, res) => {
  const description = metaHelper.getIndexDescription(SECTION_ENTITIES);

  section.id = null;
  section.subtitle = null;

  const meta = {
    description,
    section,
  };

  res.render(template, { title, meta, robots: headers.robots });
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);

  let entity;
  let adapted;
  let description;

  try {
    entity = await entities.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (entity.exists) {
    adapted = entity.adapted;

    description = metaHelper.getDetailDescription(adapted.name);
    section.id = adapted.id;
    section.subtitle = adapted.name;
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
