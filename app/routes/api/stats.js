const createError = require('http-errors');
const express = require('express');

const { Labels } = require('../../helpers/labels');

const sources = require('../../services/sources');

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  const labels = new Labels();

  let stats;
  let data;

  try {
    stats = await sources.getStats();

    data = {
      stats: {
        labels: {
          entries: labels.getLabel('entries', 'stats'),
          estimates: labels.getLabel('estimates', 'stats'),
        },
        sources: stats,
      },
    };

    res.status(200).json({ data });
  } catch (err) {
    console.error('Error while getting overview:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
