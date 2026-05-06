const createError = require('http-errors');
const express = require('express');

const { Labels } = require('../../helpers/labels');
const { links } = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const Meta = require('../../lib/route/meta');

const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');
const stats = require('../../services/stats');

const title = 'Remixing lobbying data published by the City of Portland, Oregon';

const labels = new Labels();

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  let results;
  let data;
  let meta;

  try {
    results = await Promise.all([
      incidents.getTotal(),
      incidents.getFirstAndLastDates(),
      stats.getStats(),
    ]);

    const [total, firstAndLast, homeStats] = results;
    const [first, last] = await incidentAttendees.getAllForIncidents([
      firstAndLast.first,
      firstAndLast.last,
    ]);

    // todo: delete incidents and total

    data = {
      home: {
        header: {
          intro: labels.getLabel('header_intro', 'home', {
            first_id: first.id, // eslint-disable-line camelcase
            first_label: first.contactDate, // eslint-disable-line camelcase
            first_pathname: first.links.self, // eslint-disable-line camelcase
            last_id: last.id, // eslint-disable-line camelcase
            last_label: last.contactDate, // eslint-disable-line camelcase
            last_pathname: last.links.self, // eslint-disable-line camelcase
            pathname: links.incidents(), // eslint-disable-line camelcase
            total,
          }),
          note: labels.getLabel('header_note', 'home'),
        },
        overview: {
          title: labels.getLabel('overview_title', 'home'),
          intro: labels.getLabel('overview_intro', 'home'),
        },
      },
      incidents: {
        first,
        last,
        total,
      },
      stats: {
        home: homeStats,
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
