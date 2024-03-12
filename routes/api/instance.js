const express = require('express');
const router = express.Router();
const manager = require('../../manager');

router.get('/', function (req, res, next) {
    res.json(manager.instance.getInstances());
});

router.post('/', function (req, res, next) {
    const options = req.body;
    manager.instance.cloneInstance(options, (err, instance) => {
        if (err) {
            return res.status(400).json(err);
        }

        res.json(instance);
    });
});

router.post('/start', function (req, res, next) {
    const uuid = req.body.uuid;

    if(!manager.instance.checkExistInstance(uuid)){
        return res.status(404).json(new Error('Not found'));
    }

    manager.instance.startInstance(uuid);
    res.json({
        result: 'ok'
    });
});

router.post('/stop', function (req, res, next) {
    const uuid = req.body.uuid;

    if(!manager.instance.checkExistInstance(uuid)){
        return res.status(404).json(new Error('Not found'));
    }

    manager.instance.stopInstance(uuid);
    res.json({
        result: 'ok'
    });
});

router.post('/train', function (req, res, next) {
    const uuid = req.body.uuid;

    if(!manager.instance.checkExistInstance(uuid)){
        return res.status(404).json(new Error('Not found'));
    }

    const dataset = [];
    manager.instance.train(uuid, dataset);
    res.json({
        result: 'ok'
    });
});

module.exports = router;
