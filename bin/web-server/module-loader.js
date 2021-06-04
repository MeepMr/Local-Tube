import fs from 'fs';
import {moduleScheme} from "../../models/moduleScheme.js";

/**
 * @type {Map.<String, moduleScheme>}>}
 */
let moduleMap = new Map();
let moduleRegEx = '';

let loadModules = async function () {

    let moduleFiles = fs.readdirSync('./bin/download-modules');

    for (let moduleFile of moduleFiles) {

        let {moduleName, getUrl, getOutPut} = await import(`../download-modules/${moduleFile}`);
        let module = new moduleScheme(moduleName,getUrl,getOutPut);
        moduleMap.set(moduleName, module);

        if(moduleRegEx === '')
            moduleRegEx = moduleName;
        else
            moduleRegEx += `|${moduleName}`;
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
    let identifier = videoId.substring(moduleSplitIndex+1);
    return {module, identifier};
};

export {loadModules, spliceVideoId, moduleMap, moduleRegEx}
