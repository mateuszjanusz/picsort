#!/usr/bin/env node

const Picsort = require('../lib/picsort')
const program = require('commander')
let source = ''
let destination = ''

program
	.version('0.1.0')
	.description('Organize your photos by date in one click!')
	.usage('[source-path] [destination-path] [option]')
	.option('-d, --day', 'Organize photos by year/month/day/')
	.option('-m, --month', 'Organize photos by year/month/ <DEFAULT>')
	.option('-y, --year', 'Organize photos by year/')
	.arguments('<src> [dest]')
	.action(function (src, dest) {
		source = src
		destination = dest
	})
	.parse(process.argv)

if (!source) program.help()

if(program.year){
	return Picsort.sortImagesByYear(source, destination)
} else if(program.month){
	return Picsort.sortImagesByMonth(source, destination)
} else if(program.day){
	return Picsort.sortImagesByDay(source, destination)
} else {
	return Picsort.sortImagesByMonth(source, destination)
}
