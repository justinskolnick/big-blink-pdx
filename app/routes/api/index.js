const express = require('express');

const restrictToJsonMiddleware = require('../../middleware/restrict-to-json');

const entitiesRouter = require('./entities');
const homeRouter = require('./home');
const incidentsRouter = require('./incidents');
const leaderboardRouter = require('./leaderboard');
const peopleRouter = require('./people');
const sourcesRouter = require('./sources');
const statsRouter = require('./stats');

const router = express.Router();

router.use('/', restrictToJsonMiddleware);

router.use('/entities', entitiesRouter);
router.use('/home', homeRouter);
router.use('/incidents', incidentsRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/people', peopleRouter);
router.use('/sources', sourcesRouter);
router.use('/stats', statsRouter);

router.get('/', (req, res) => {
  res.status(200);
});

module.exports = router;
