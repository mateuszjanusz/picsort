#!/usr/bin/env node

const Sorter = require('../lib/sort')

console.log(process.argv)

const user_args = process.argv.slice(2)
console.log(user_args)

const path_to_images = user_args[0] || '.'

// Sorter.sayHello()