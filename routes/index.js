var express = require('express');
var router = express.Router();
const api = require('./api');

router.use('/api', api);

router.get('/', function (req, res, next) {
  res.send('GPT Hub for ALICE');
});

module.exports = router;
