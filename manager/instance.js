const fs = require('fs');
const portfinder = require('portfinder');

const GPT_PATH = './gpt';
const instances = [{
    name: 'test',
    port: 8001
}];

portfinder.setBasePort(40000);
portfinder.setHighestPort(49999);

const models = [{
    name: 'FLAN-T5-KOR',
    path: 'flan-t5-kor'
}]

function getModelList() {
    return models;
}

function makePM2JSON() {
    const json = {
        apps: []
    }

    for (const instance of instances) {
        json.apps.push({
            name: instance.name,
            cmd: 'test.py',
            args: '' + instance.port,
            interpreter: 'python3'
        });
    }

    const pm2conf = 'module.exports = ' + JSON.stringify(json);
    fs.writeFileSync(GPT_PATH  + '/gpt.pm2.config.js', pm2conf);
}

function cloneInstance(options, callback) {
    portfinder.getPort((err, port) => {
        if (err) {
            return callback(err);
        }

        makePM2JSON();

        callback(err, port);
    });
}

function startInstance(uuid) {

}

function stopInstance(uuid) {

}

function train(uuid, dataset) {

}

module.exports.getModelList = getModelList;
module.exports.cloneInstance = cloneInstance;
