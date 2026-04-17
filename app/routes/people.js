const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const { SECTION_PEOPLE } = require('../config/constants');

const metaHelper = require('../helpers/meta');

const headers = require('../lib/headers');
const Meta = require('../lib/route/meta');

const people = require('../services/people');

const title = 'People';
const template = 'main';

router.get('/', (req, res) => {
  const meta = new Meta(req);
  meta.setOtherValues({
    description: metaHelper.getIndexDescription(SECTION_PEOPLE),
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
    result = await people.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (result?.exists) {
    if (result.hasMoved) {
      return res.redirect(`/people/${result.identicalId}`);
    }

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
