const fs = require('fs')
const ExifImage = require('exif').ExifImage
const moment = require('moment')
const _ = require('lodash')

module.exports = {

	sortImagesByDay(source, destination){

	},
	sortImagesByMonth(source, destination){

	},
	sortImagesByYear(source, destination){

	},

	sortImagesByDate(directory) {
		if(!fs.existsSync(directory)){
			console.log("No such file or directory =>", directory)
			return
		}

		const _this = this
		const dir = _this.formatDirectoryPath(directory)
		const total = fs.readdirSync(dir).length
		fs.readdirSync(dir).forEach((file, index) => {
			console.log("progress:", index,"of",total)
			const filename = _.clone(file).toLowerCase()
			const is_image = _.endsWith(filename, 'jpg') || _.endsWith(filename, 'jpeg')
			
			if(is_image){
				const image_path = dir + file
				try {
					new ExifImage({ image : image_path }, function (error, exifData) {
				        if (error) {
				        	console.log("No Exif segment found in the image: ", file)
				        } else {
				        	const exif = exifData.exif
				        	const image_data = exifData.image
				        	const image_timespan = exif.DateTimeOriginal || exif.CreateDate || image_data.ModifyDate

				        	if(image_timespan){
				        		const date = moment(image_timespan.split(' ')[0], ['YYYY:MM:DD'])
						        const year = moment(date, ['YYYY:MM:DD']).format('YYYY')
						        const month = moment(date).format('MM-MMMM')
						        const destination = _this.getDestination(dir, year, month)

	    			            // console.log("this image would go to: ", destination)
	    			            _this.moveFile(file, image_path, destination)  

				        	} else {
				        		_this.moveToUnknowns(dir, file)
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

	formatDirectoryPath(directory){
		let dir = _.clone(directory)
		if(!dir){
			dir = './'
		}
		if(!dir.charAt(dir.length-1).includes('/')){
			dir = dir + '/'
		}

		return dir 
	},
 
	setupDirectory(directory, name) {
		directory = this.formatDirectoryPath(directory)
		const dir_path = directory + name

		if(!fs.existsSync(dir_path)){
			fs.mkdirSync(dir_path)
		}
		return dir_path
	},

	getDestination(dir, year, month) {
		const sorted_folder = this.setupDirectory(dir, 'Sorted')
		const year_folder = this.setupDirectory(sorted_folder, year)
		const month_folder = this.setupDirectory(year_folder, month)

		return month_folder
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
