const fs = require('fs')
const ExifImage = require('exif').ExifImage
const moment = require('moment')
const _ = require('lodash')

module.exports = {

	async sortImagesByDay(source){
		if(this.exists(source)){
			await this.sortImages({
				source,
				by_day: true,
				by_month: true,
				by_year: true
			})
			console.log("DONE")
		}
	},
	async sortImagesByMonth(source){
		if(this.exists(source)){
			await this.sortImages({
				source,
				by_day: false,
				by_month: true,
				by_year: true
			})
			console.log("DONE")
		}
	},
	async sortImagesByYear(source){
		if(this.exists(source)){
			await this.sortImages({
				source,
				by_day: false,
				by_month: false,
				by_year: true
			})
			console.log("DONE")
		}
	},

	sortImages({source, by_day, by_month, by_year}) {
		const _this = this

		source = _this.formatDirectoryPath(source)

		// const total = fs.readdirSync(dir).length
		fs.readdirSync(source).forEach((file, index) => {
			// console.log("progress:", index,"of",total)
			const filename = _.clone(file).toLowerCase()
			const is_image = _.endsWith(filename, 'jpg') || _.endsWith(filename, 'jpeg')
			
			if(is_image){
				const image_path = source + file
				try {
					new ExifImage({ image : image_path }, function (error, exifData) {
				        if (!error && exifData) {
				        	const exif = exifData.exif
				        	const image_data = exifData.image
				        	const image_timespan = exif.DateTimeOriginal || exif.CreateDate || image_data.ModifyDate

				        	if(image_timespan){
				        		const date = moment(image_timespan.split(' ')[0], ['YYYY:MM:DD'])
						        const year = moment(date, ['YYYY:MM:DD']).format('YYYY')
						        const month = by_month ? moment(date).format('MM-MMMM') : null
						        const day = by_day ? moment(date).format('DD') : null
						        const destination = _this.getDestination(source, year, month, day)

	    			            _this.moveFile(file, image_path, destination)  

				        	}
				        } else {
				        	// console.log(file)
				        	const filename = file.split('.')[0]
				        	const date_formats = ['YYYY:MM:DD', 'YYYY/MM/DD', 'YYYY-MM-DD']
				        	const is_valid = moment(filename, date_formats).isValid()
				        	if(is_valid){
				        		const date = moment(filename)
				        		const year = moment(date, ['YYYY:MM:DD']).format('YYYY')
						        const month = by_month ? moment(date).format('MM-MMMM') : null
						        const day = by_day ? moment(date).format('DD') : null
						        const destination = _this.getDestination(source, year, month, day)
	    			            _this.moveFile(file, image_path, destination)  
				        	}
				        }
				    })
				} catch(err){
					// console.log(err)
				}  
			} else {
				console.log("The given file's format is not an image or is unsupported right now", file)
			}

		})
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

	moveFile(file_name, image_path, destination){
		destination = this.formatDirectoryPath(destination)
		destination = destination + file_name

		if(!fs.existsSync(destination)){
			fs.renameSync(image_path, destination)
		} else {
			destination = destination + '-dupe'
			fs.renameSync(image_path, destination)
		}
	},

	moveToUnknowns(directory, file_name){
		const destination = this.setupDirectory(directory, 'Unknowns')
		const image_path = directory + file_name
		this.moveFile(file_name, image_path, destination)
	},
}
