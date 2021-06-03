import fs from 'fs';

/**
 * @type {Map.<String, moduleScheme>}>}
 */
let moduleMap = new Map();

let loadModules = async function () {

    let moduleFiles = fs.readdirSync('./bin/download-modules');

    for (let moduleFile of moduleFiles) {

        let module = await import(`../download-modules/${moduleFile}`);
        moduleMap.set(module.moduleName, module);
    }

    console.log('Loaded Modules:');
    console.log(moduleMap);

};

/**
 * @param videoId {String}
 * @returns {{identifier: string, module: moduleScheme}}
 */
let spliceVideoId = function (videoId) {

    let moduleSplitIndex = videoId.indexOf('-');
    let moduleName = videoId.substring(0, moduleSplitIndex);
    let module = moduleMap.get(moduleName);
    let identifier = videoId.substring(moduleSplitIndex);
    return {module, identifier};
};

export {loadModules, moduleMap, spliceVideoId}