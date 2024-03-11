const portfinder = require('portfinder');

portfinder.setBasePort(40000);
portfinder.setHighestPort(49999);
    
const models = [{
    name: 'FLAN-T5-KOR',
    path: 'flan-t5-kor'
}]

function getModelList() {
    return models;
}

function cloneInstance(model, options, callback) {
    portfinder.getPort((err, port) => {
        callback(err, port);
    });
}

module.exports.getModelList = getModelList;
module.exports.cloneInstance = cloneInstance;
