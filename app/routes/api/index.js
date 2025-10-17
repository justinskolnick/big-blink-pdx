const express = require('express');

const restrictToJsonMiddleware = require('../../middleware/restrict-to-json');

const statsRouter = require('./stats');

const router = express.Router();

router.use('/', restrictToJsonMiddleware);

router.use('/stats', statsRouter);

router.get('/', (req, res) => {
  res.status(200);
});

module.exports = router;
