const express = require('express');

const restrictToJsonMiddleware = require('../../middleware/restrict-to-json');

const entitiesRouter = require('./entities');
const peopleRouter = require('./people');
const statsRouter = require('./stats');

const router = express.Router();

router.use('/', restrictToJsonMiddleware);

router.use('/entities', entitiesRouter);
router.use('/people', peopleRouter);
router.use('/stats', statsRouter);

router.get('/', (req, res) => {
  res.status(200);
});

module.exports = router;
