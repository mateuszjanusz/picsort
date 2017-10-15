#!/usr/bin/env node

const Picsort = require('../lib/index')

// console.log(process.argv)

const user_args = process.argv.slice(2)
console.log(user_args)

const path_to_images = user_args[0] || '.'

Picsort.sortImagesByDate(path_to_images)