const fs = require('fs')
const path = require('path')
const ExifImage = require('exif').ExifImage
const moment = require('moment')
const _ = require('lodash')

module.exports = {

	async sortImagesByDay(source){
		if(this.exists(source)){
			await this.sortImages({
				source,
				by_day: true,
				by_month: true
			})
		}
	},
	async sortImagesByMonth(source){
		if(this.exists(source)){
			await this.sortImages({
				source,
				by_day: false,
				by_month: true
			})
		}
	},
	async sortImagesByYear(source){
		if(this.exists(source)){
			await this.sortImages({
				source,
				by_day: false,
				by_month: false
			})
		}
	},

	exists(source){
		return fs.existsSync(source)
	},

	formatDirectoryPath(directory){
		let dir = _.clone(directory)

		if(!dir.charAt(dir.length-1).includes('/')){
			dir = dir + '/'
		}

		return dir 
	},
 
	setupDirectory(path, name) {
		path = this.formatDirectoryPath(path)
		const new_dir = path + name

		if(!fs.existsSync(new_dir)){
			fs.mkdirSync(new_dir)
		}
		return new_dir
	},

	getDestination(src, year, month, day) {
		let destination = this.setupDirectory(src, year)
		if(month){
			destination = this.setupDirectory(destination, month)
			if(day){
				destination = this.setupDirectory(destination, day)
			}
		}
		return destination
	},

	async moveFile(file_name, image_loc, destination){
		destination = this.formatDirectoryPath(destination)
		const new_dest = destination + file_name

		if(!this.exists(new_dest)){
			await fs.renameSync(image_loc, new_dest)
		} else {
			dupe = 'dupe-' + file_name
			destination = destination + dupe
			await fs.renameSync(image_loc, destination)
		}
	},

	moveToUnknowns(directory, file_name){
		const destination = this.setupDirectory(directory, 'Unknowns')
		const image_path = directory + file_name
		this.moveFile(file_name, image_path, destination)
	},

	sortImages({source, by_day, by_month}) {
		const _this = this
    	const date_formats = ['YYYY:MM:DD', 'YYYY/MM/DD', 'YYYY-MM-DD']
		source = _this.formatDirectoryPath(source)

		const files = fs.readdirSync(source)

		files.forEach((file, index) => {

			const filename = _.clone(file).toLowerCase()
			const image = source + file
		
			try {
				new ExifImage({image}, function (err, img) {
					let date 
			        if (!err && img && (img.exif.DateTimeOriginal || img.exif.CreateDate)) {
			        	const exif_timespan = img.exif.DateTimeOriginal || img.exif.CreateDate
			        	if(exif_timespan)
			        		date = moment(exif_timespan.split(' ')[0], date_formats)
			        } else {
			        	//file does not have exif data; trying to get date using fs.statSync
			        	const file_data = fs.statSync(source)
			        	let file_birthtime = file_data.birthtime || file_data.ctime
			        	console.log(file_birthtime)
		        		date = moment(file_birthtime, date_formats)
			        	console.log(date)

			        }

			        if(date){
			        	const year = moment(date, date_formats).format('YYYY')
				        const month = by_month ? moment(date).format('MM-MMMM') : null
				        const day = by_day ? moment(date).format('DD') : null
				        const destination = _this.getDestination(source, year, month, day)

			            _this.moveFile(file, image, destination)  
			        }
			    })
			} catch(err){
				console.log(err)
			}  

		})

	}
}