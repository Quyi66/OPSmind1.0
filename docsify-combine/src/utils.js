const fs = require("fs");
const util = require("util");
const path = require("path");
// const rimraf = require("rimraf");
// const yesno = require("yesno");
require("colors");

const logger = require("./logger.js");

const [mkdir, exists] = [fs.mkdir, fs.exists].map(fn => util.promisify(fn));

const safetyMkdir = async rawPath => {
    const resolvedPath = path.resolve(rawPath);

    const isExist = await exists(resolvedPath);

    if (!isExist) {
        return await mkdir(resolvedPath);
    }

    return Promise.resolve();
};

// const removeArtifacts = async paths =>
//     Promise.all(paths.map(path => new Promise(resolve => {
//         rimraf(path, resolve);
//     })));

const prepareEnv = ({targetDir/*, pathToPublic*/}) => () => {
    const pathToStaticDir = path.resolve(targetDir);
    // const pathToPublicDir = path.dirname(path.resolve(pathToPublic));

    return Promise.all([safetyMkdir(pathToStaticDir)/*, safetyMkdir(pathToPublicDir)*/]).catch(err => {
        logger.err("prepareEnv", err);
    });
};

// const cleanUp = ({targetDir, pathToPublic, removeTemp}) => async () => {
//     console.log('targetDir', path.resolve(targetDir));
//     const isExist = await exists(path.resolve(targetDir));
//
//     if (!isExist) {
//         return Promise.resolve();
//     }
//
//     const questionStatic = `Path "${path.resolve(
//         targetDir,
//     )}" reserved for statics is already exists.${
//         removeTemp ? " It will be deleted." : ""
//     } Continue evaluating? (y/n)`.yellow;
//
//     const answer = await yesno.askAsync(questionStatic);
//
//     if (answer) {
//         return removeArtifacts([path.resolve(pathToPublic)]);
//     } else {
//         return Promise.reject("User stops evaluating");
//     }
// };

module.exports = config => ({
    prepareEnv: prepareEnv(config)
    // cleanUp: cleanUp(config)
});
