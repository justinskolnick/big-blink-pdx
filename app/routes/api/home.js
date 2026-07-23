const createError = require('http-errors');
const express = require('express');

const { Labels } = require('../../helpers/labels');
const { links } = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const Meta = require('../../lib/route/meta');

const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');
const stats = require('../../services/stats');

const labels = new Labels();

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  let title;
  let results;
  let data;
  let meta;

  try {
    title = labels.getLabel('title', 'global');

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
            pathname: links.incidents(),
            total,
          }),
          note: labels.getLabel('header_note', 'home'),
        },
        overview: {
          title: labels.getLabel('overview_title', 'home'),
          intro: labels.getLabel('overview_intro', 'home'),
          details: labels.getLabel('overview_details', 'home'),
        },
      },
      incidents: {
        first,
        last,
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
      meta: meta.toObject(),
    });
  } catch (err) {
    console.error('Error while getting home:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
