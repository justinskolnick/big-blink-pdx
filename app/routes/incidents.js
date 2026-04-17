const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');
const Meta = require('../lib/route/meta');

const incidents = require('../services/incidents');

const title = 'Incidents';
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

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);

  let result;
  let adapted;

  try {
    result = await incidents.getAtId(id);
  } catch (err) {
    console.error('Error while getting incident:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (result?.exists) {
    adapted = result.adapted;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  const meta = new Meta(req, {
    ...adapted,
    name: 'Incident',
  });
  meta.setOtherValues({
    description: metaHelper.getDetailDescription(),
  });

  res.render(template, {
    title,
    meta: meta.toObject(),
    robots: headers.robots,
  });
});

module.exports = router;
