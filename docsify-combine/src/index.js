const {merge} = require("lodash");
const logger = require("./logger.js");
const fs = require('fs');

const defaultConfig = {
    targetDir: "static",
    docsifyRoot: ".",
    // pathToPublic: "./pdf/readme.pdf",
    targetMdFilename: "main.md",
    // removeTemp: true,
    contents: "docs/_sidebar.md",
    // pdfOptions: {format: "A4"},
    // emulateMedia: "print"
};

const run = async incomingConfig => {
    const config = merge(defaultConfig, incomingConfig);
    logger.info('Generate docs from dir: ' + config.docsifyRoot);
    const tocFile = generateTocFile();
    config.contents = [tocFile];
    config.targetMdFilename = config.targetMdFilename.replace('${VERSION}', config.docVer);
    logger.info('Build with settings:\n' + JSON.stringify(config, null, 2));
    const {combineMarkdowns} = require("./markdown-combine.js")(config);
    const {prepareEnv} = require("./utils.js")(config);
    const {createRoadMap} = require("./contents-builder.js")(config);

    try {
        await prepareEnv();
        const roadMap = await createRoadMap();
        await combineMarkdowns(roadMap);
    } catch (error) {
        logger.err("run error", error);
    } finally {
        // closeProcess(0);
    }

    function getMdFilePath(filepath) {
        return config.docsifyRoot + '/' + filepath;
    }

    function generateTocFile() {
        let modules = config.modules;
        let tocString = '';
        if (config.coverPageFile) {
            let file = getMdFilePath(config.coverPageFile);
            let str = fs.readFileSync(file, {encoding: 'utf8'});
            // console.log(config.coverPageFile, file, str);
            str = str.replace('${VERSION}', config.docVer);
            str = str.replace('${DATE}',config.releaseDate);
            fs.writeFileSync(getMdFilePath('_generated_cover.md'), str);
            tocString += '\n[Cover](_generated_cover.md)\n\n';
        }
        let tocFile = config.docsifyRoot + '/_generated_toc.md';
        modules.forEach(mod => {
            let sidebar = fs.readFileSync(getMdFilePath(mod + '/_sidebar.md'));
            tocString += sidebar + '\n';
        });
        fs.writeFileSync(tocFile, tocString);
        return tocFile;
    }
};
module.exports = run;
