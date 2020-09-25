"use strict";
exports.__esModule = true;
var yaml = require("js-yaml");
var fs_1 = require("fs");
var core_1 = require("@actions/core");
// Fetch file to load from environment
var path = core_1.getInput('path');
var debug = core_1.getInput('debug').toLocaleLowerCase() == 'true';
var delimiter = core_1.getInput('delimiter');
// Verify the existence of file
if (!fs_1.existsSync(path)) {
    console.log("::error ::File '" + path + "' not found");
    process.exit(1);
}
// Load file
if (path.toLowerCase().endsWith('.yaml') || path.toLowerCase().endsWith('.yml')) {
    recursive(yaml.safeLoad(fs_1.readFileSync(path).toString()));
}
else if (path.toLowerCase().endsWith('.json')) {
    recursive(JSON.parse(fs_1.readFileSync(path).toString()));
}
else {
    console.log("::error ::Content type of '" + path + "' not supported. Please provide JSON or YAML file.");
    process.exit(1);
}
function recursive(obj) {
    if (typeof obj === 'object' && obj !== null) {
        for (var k in obj)
            recursive_level(k, obj[k]);
    }
    else {
        console.log("::error ::Content in '" + path + "' is not an object.");
    }
}
function recursive_level(key, obj) {
    switch (typeof obj) {
        case 'object':
            for (var k in obj)
                recursive_level("" + key + delimiter + k, obj[k]);
            break;
        case 'boolean':
        case 'number':
        case 'string':
            writeOutput(key, obj);
            break;
    }
}
// Write as output parameter for Github Actions.
// https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#setting-an-output-parameter
function writeOutput(key, value) {
    if (debug)
        console.log("steps.[id].outputs." + key + " => " + value);
    console.log("::set-output name=" + key + "::" + value);
}
