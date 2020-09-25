import * as yaml from 'js-yaml'
import { existsSync, readFileSync } from 'fs'
import { getInput } from '@actions/core'

// Fetch file to load from environment
let path = getInput('path')
let debug = getInput('debug').toLocaleLowerCase() == 'true'
let delimiter = getInput('delimiter')

// Verify the existence of file
if (!existsSync(path)) {
    console.log(`::error ::File '${path}' not found`)
    process.exit(1)
}

// Load file
if (path.toLowerCase().endsWith('.yaml') || path.toLowerCase().endsWith('.yml')) {
    recursive(yaml.safeLoad(readFileSync(path).toString()))
} else if (path.toLowerCase().endsWith('.json')) {
    recursive(JSON.parse(readFileSync(path).toString()))
} else {
    console.log(`::error ::Content type of '${path}' not supported. Please provide JSON or YAML file.`)
    process.exit(1)
}

function recursive(obj: any) {
    if (typeof obj === 'object' && obj !== null) {
        for (let k in obj)
            recursive_level(k, obj[k])
    } else {
        console.log(`::error ::Content in '${path}' is not an object.`)
    }
}

function recursive_level(key: string, obj: any) {
    switch (typeof obj) {
        case 'object':
            for (let k in obj)
                recursive_level(`${key}${delimiter}${k}`, obj[k])
            break
        case 'boolean':
        case 'number':
        case 'string':
            writeOutput(key, obj as string)
            break
    }
}

// Write as output parameter for Github Actions.
// https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#setting-an-output-parameter
function writeOutput(key: string, value: string) {
    if (debug)
        console.log(`steps.[id].outputs.${key} => ${value}`)
    console.log(`::set-output name=${key}::${value}`)
}