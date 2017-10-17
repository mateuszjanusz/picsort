#!/usr/bin/env node

const Picsort = require('../lib/picsort')
const program = require('commander')
let source = ''

program
	.version('0.1.0')
	.description('Organize your photos by date. Use flags to specify sorting precision.')
	.usage('[source-path] [option]')
	.option('-d, --day', 'Organize photos by year/month/day/')
	.option('-m, --month', 'Organize photos by year/month/ <DEFAULT>')
	.option('-y, --year', 'Organize photos by year/')
	.arguments('<src>')
	.action(function (src) {
		source = src
	})
	.parse(process.argv)

if (!source) program.help()

if(program.year){
	return Picsort.sortImagesByYear(source)
} else if(program.month){
	return Picsort.sortImagesByMonth(source)
} else if(program.day){
	return Picsort.sortImagesByDay(source)
} else {
	return Picsort.sortImagesByMonth(source)
}
