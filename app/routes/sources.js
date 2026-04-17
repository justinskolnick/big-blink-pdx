const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');
const Meta = require('../lib/route/meta');

const sources = require('../services/sources');

const title = 'Data Sources';
const template = 'main';

router.get('/', (req, res) => {
  const meta = new Meta(req);
  meta.setOtherValues({
    description: metaHelper.getIndexDescription(),
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
    result = await sources.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (result?.exists) {
    adapted = result.adapted;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  const meta = new Meta(req, adapted);
  meta.setOtherValues({
    description: metaHelper.getDetailDescription(adapted.title, 'from'),
  });

  res.render(template, {
    title,
    meta: meta.toObject(),
    robots: headers.robots,
  });
});

module.exports = router;
