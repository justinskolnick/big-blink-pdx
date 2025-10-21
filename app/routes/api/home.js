const createError = require('http-errors');
const express = require('express');

const metaHelper = require('../../helpers/meta');

const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');

const title = 'Remixing lobbying data published by the City of Portland, Oregon';
const section = {};

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  const description = metaHelper.getIndexDescription();
  const meta = metaHelper.getMeta(req, {
    description,
    pageTitle: title,
    section,
  });

  let data;

  try {
    const results = await Promise.all([
      incidents.getTotal(),
      incidents.getFirstAndLastDates(),
    ]);
    const [total, firstAndLast] = results;
    const [first, last] = await incidentAttendees.getAllForIncidents([
      firstAndLast.first,
      firstAndLast.last,
    ]);

    data = {
      incidents: {
        first,
        last,
        total,
      },
    };

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting home:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
