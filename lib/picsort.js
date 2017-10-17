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
		destination = destination + file_name

		if(!fs.existsSync(destination)){
			await fs.renameSync(image_loc, destination)
		} else {
			destination = destination + '-dupe'
			await fs.renameSync(image_loc, destination)
		}
	},

	moveToUnknowns(directory, file_name){
		const destination = this.setupDirectory(directory, 'Unknowns')
		const image_path = directory + file_name
		this.moveFile(file_name, image_path, destination)
	},

	sortImages({source, by_day, by_month, by_year}) {
		const _this = this
    	const date_formats = ['YYYY:MM:DD', 'YYYY/MM/DD', 'YYYY-MM-DD']
		source = _this.formatDirectoryPath(source)

		fs.readdirSync(source).forEach((file, index) => {
			const filename = _.clone(file).toLowerCase()
			const image = source + file
			const is_jpg = _.endsWith(filename, 'jpg') || _.endsWith(filename, 'jpeg')

			if(is_jpg){
				try {
					new ExifImage({image}, function (err, img) {
						let date 
				        if (!err && img && (img.exif.DateTimeOriginal || img.exif.CreateDate)) {
				        	const exif_timespan =  img.exif.DateTimeOriginal || img.exif.CreateDate
				        	if(exif_timespan)
				        		date = moment(exif_timespan.split(' ')[0], date_formats)
				        } else {
				        	//file does not have exif data; trying to get date from file name
				        	const fn = filename.substr(0, filename.length-4)

				        	const is_valid = moment(fn, date_formats).isValid()
				        	
				        	if(is_valid){
				        		date = moment(fn, date_formats)
				        	}
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
			} else {
				// console.log("The given file's format is not an image or is unsupported right now", file)
			}

		})
	},
}
