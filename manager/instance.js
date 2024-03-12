const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const portfinder = require('portfinder');
const { exec } = require('child_process');

const GPT_PATH = './gpt';
const MODEL_PATH = 'base';
const INSTANCE_PATH = 'instance';
const instances = [];

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
            name: 'gpt_' + instance.uuid,
            cmd: 'test.py',
            args: '' + instance.port + ' ' + instance.model,
            interpreter: 'python3',
            info: instance
        });
    }

    const pm2conf = 'module.exports = ' + JSON.stringify(json);
    fs.writeFileSync(GPT_PATH + '/gpt.pm2.config.js', pm2conf);
}

function findFreePort() {
    return new Promise(async (resolve, reject) => {
        while (true) {
            try {
                const port = await portfinder.getPortPromise();

                for (const item of instances) {
                    if (item.port === port) {
                        //기존에 사용중인 포트(실행하지 않아도 예약된 포트)
                        continue;
                    }
                }

                //쓸수 있는 포트다
                return resolve(port);
            }
            catch (err) {
                return reject(err);
            }
        }
    });
}

function copyModelToInstance(model, uuid) {
    const modelPath = path.join(GPT_PATH, MODEL_PATH, model);
    const instancePath = path.join(GPT_PATH, INSTANCE_PATH, uuid);
    fs.cp(modelPath, instancePath, {recursive: true}, (err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log('success');
        }
    });
}

//Exports
function getInstances() {
    return instances;
}

function cloneInstance(options, callback) {
    if (!options.name || !options.model) {
        return callback(new Error('name and model options are need'));
    }

    findFreePort().then(port => {
        console.log('Reserve port', port);

        const newInstance = {
            uuid: uuid.v1(),
            name: options.name,
            model: options.model,
            port: port
        }

        instances.push(newInstance);

        copyModelToInstance(options.model, newInstance.uuid);

        makePM2JSON();
        callback(null, newInstance);
    }).catch(err => {
        callback(err);
    });
}

function startInstance(uuid) {
    exec('pm2 start gpt.pm2.config.js gpt_' + uuid, {
        cwd: './gpt'
    }, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(stdout);
    });
}

function stopInstance(uuid) {
    exec('pm2 stop gpt.pm2.config.js gpt_' + uuid, {
        cwd: './gpt'
    }, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(stdout);
    });
}

function train(uuid, dataset) {
    const dataPath = GPT_PATH + '/' + uuid + '.csv';
    console.log(dataPath);

    exec('python3 traintest.py ' + uuid, {
        cwd: './gpt'
    }, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(stdout);
    });
}

function checkExistInstance(uuid){
    for (const item of instances) {
        if(item.uuid === uuid){
            return true;
        }
    }

    return false;
}

module.exports.getModelList = getModelList;
module.exports.getInstances = getInstances;
module.exports.cloneInstance = cloneInstance;
module.exports.startInstance = startInstance;
module.exports.stopInstance = stopInstance;
module.exports.train = train;
module.exports.checkExistInstance = checkExistInstance;
