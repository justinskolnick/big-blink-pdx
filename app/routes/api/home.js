const createError = require('http-errors');
const express = require('express');

const metaHelper = require('../../helpers/meta');

const Meta = require('../../lib/route/meta');

const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');

const title = 'Remixing lobbying data published by the City of Portland, Oregon';

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  let data;
  let meta;

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

    meta = new Meta(req);
    meta.setOtherValues({
      description: metaHelper.getIndexDescription(),
    });
    meta.setCustomPageTitle(title);

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(false),
    });
  } catch (err) {
    console.error('Error while getting home:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
