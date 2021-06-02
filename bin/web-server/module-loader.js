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

export {loadModules, moduleMap}