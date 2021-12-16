import fs from 'fs';
import {moduleScheme} from "../../models/moduleScheme.js";

/**
 * @type {Map.<String, moduleScheme>}>}
 */
const moduleMap = new Map();
let moduleRegEx = '';

const loadModules = async function () {

    const moduleFiles = fs.readdirSync('./bin/download-modules');

    for (let moduleFile of moduleFiles) {

        const {moduleName, getUrl, getOutPut} = await import(`../download-modules/${moduleFile}`);
        const module = new moduleScheme(moduleName,getUrl,getOutPut);
        moduleMap.set(moduleName, module);

        if(moduleRegEx === '')
            moduleRegEx = moduleName;
        else
            moduleRegEx += `|${moduleName}`;
    }

    console.log('Loaded Modules:');
    for(let module of moduleMap.values())
        console.log(module.moduleName);

};

/**
 * @param videoId {String}
 * @returns {{identifier: string, module: moduleScheme}}
 */
const spliceVideoId = function (videoId) {

    const moduleSplitIndex = videoId.indexOf('-');
    const moduleName = videoId.substring(0, moduleSplitIndex);

    const module = moduleMap.get(moduleName);
    const identifier = videoId.substring(moduleSplitIndex+1);
    return {module, identifier};
};

export {loadModules, spliceVideoId, moduleMap, moduleRegEx}
