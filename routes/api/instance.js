const express = require('express');
const router = express.Router();
const manager = require('../../manager');

router.get('/', function (req, res, next) {
    manager.instance.cloneInstance('model', {}, (err, port) => {
        if (err) {
            return res.status(400).json(err);
        }

        res.json({
            port: port
        });
    });
});

router.post('/', function (req, res, next) {
    manager.instance.cloneInstance('model', {}, (err, port) => {
        if (err) {
            return res.status(400).json(err);
        }

        res.json({
            port: port
        });
    });
});

module.exports = router;
