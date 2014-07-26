#!/usr/bin/env node
var Cli = require('../lib/cli');
Cli(process.argv, function(code, env){});