#!/usr/bin/env node

const Picsort = require('../lib/index')

const user_args = process.argv.slice(2)


if(user_args[0] === '-h'){
	console.log("instructions here")
} else {
	const path_to_images = user_args[0] || '.'

	Picsort.sortImagesByDate(path_to_images)
}

