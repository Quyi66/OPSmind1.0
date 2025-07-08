const fs = require("fs");
const util = require("util");
const path = require("path");
const logger = require("./logger.js");
const beautifyImages = require("./beautify-image-paths.js");
// Use harmonize
// Fix error thrown from markdown-link-extractor/node_modules/marked/src/Tokenizer.js line 552
// which caused by Nodejs v8-v9 nodejs regex
//https://github.com/markedjs/marked/issues/1937
//https://stackoverflow.com/questions/29676675/how-to-run-gulp-with-harmony-flag
require("harmonize")();

const [readFile, writeFile, exists] = [fs.readFile, fs.writeFile, fs.exists].map(fn =>
    util.promisify(fn),
);

const combineMarkdowns = ({contents, targetDir, targetMdFilename}) => async links => {
    try {
        const files = await Promise.all(
            await links.map(async filename => {
                const fileExist = await exists(filename);
                if (fileExist) {
                    const content = await readFile(filename, {
                        encoding: "utf8",
                    });
                    return {
                        content,
                        name: filename,
                    };
                }
                throw new Error(`file ${filename} is not exist, but listed in ${contents}`);
            }),
        );

        const resultFilePath = path.resolve(targetDir, targetMdFilename);
        logger.info('Combined markdown file: ' + resultFilePath);

        try {
            var currentFile;
            const content = files
                .map(({content, name}) => {
                    currentFile = name;
                    return beautifyImages({targetDir})(content, name)
                })
                .join("\n\n\n\n")
                //LEO:remove special tags
                .replace(/\{docsify-ignore}/g, '');
            await writeFile(resultFilePath, content);
        } catch (e) {
            logger.err('Error processing: ' + currentFile);
            throw e;
        }

        return resultFilePath;
    } catch (err) {
        logger.err("combineMarkdowns", err);
        throw err;
    }
};

module.exports = config => ({
    combineMarkdowns: combineMarkdowns(config),
});
