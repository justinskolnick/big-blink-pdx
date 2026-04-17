const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const { SECTION_ENTITIES } = require('../config/constants');

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');
const Meta = require('../lib/route/meta');

const entities = require('../services/entities');

const title = 'Entities';
const template = 'main';

router.get('/', (req, res) => {
  const meta = new Meta(req);
  meta.setOtherValues({
    description: metaHelper.getIndexDescription(SECTION_ENTITIES),
  });

  res.render(template, {
    title,
    meta: meta.toObject(),
    robots: headers.robots,
  });
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);

  let result;
  let adapted;

  try {
    result = await entities.getAtId(id);
  } catch (err) {
    console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (result?.exists) {
    adapted = result.adapted;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  const meta = new Meta(req, adapted);
  meta.setOtherValues({
    description: metaHelper.getDetailDescription(adapted.name),
  });

  res.render(template, {
    title,
    meta: meta.toObject(),
    robots: headers.robots,
  });
});

module.exports = router;
