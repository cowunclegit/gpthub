const express = require('express');
const router = express.Router();
const instance = require('./instance');

router.use('/instance', instance);

router.get('/', function (req, res, next) {
    res.json({
        name: 'GPT_Hub',
        version: '1.0'
    });
});

module.exports = router;
