#!/usr/bin/env node

const rcfile = require('rcfile');

const config = rcfile("docsifycombine");

require("../src/index.js")(config);
