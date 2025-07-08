module.exports = {
    docVer: '3.0',
    releaseDate: '2024-05-15',
    modules: ['_intro', 'acm', 'gfs', 'cmd', 'jao', 'cac', 'vap', 'udp', 'dts', 'spm', 'cicd', 'nms', 'pms', 'ra', 'sfm', 'spm', 'uim', 'upm', 'vcm'],
    coverPageFile: 'userguide-cover.md',
    // contents: [
    //     "src/main/webapp/help/userguide-toc.md",
    // ], // array of "table of contents" files path
    targetMdFilename: "OplusUserGuide_${VERSION}.md",
    // Target dir to save generated md file and images
    targetDir: "docs",
    // Docsify root path relative to working dir
    docsifyRoot: "src/webapp/help"
}