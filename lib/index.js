const fs = require('fs')
const ExifImage = require('exif').ExifImage
const moment = require('moment')
const _ = require('lodash')

module.exports = {

	sortImagesByDate(directory) {
		const _this = this

		const dir = _this.formatDirectoryPath(directory)

		fs.readdirSync(dir).forEach(file => {
			const is_image = _.endsWith(file, 'jpg') || _.endsWith(file, 'png') || _.endsWith(file, 'jpeg')
			
			if(is_image){
				const image_path = dir + file
				try {g
					new ExifImage({ image : image_path }, function (error, exifData) {
				        if (error) console.log(error)
				        else {
				        	const exif = exifData.exif
				        	const image_data = exifData.image
				        	const image_timespan = exif.DateTimeOriginal || exif.CreateDate || image_data.ModifyDate

				        	if(image_timespan){
				        		const date = moment(image_timespan.split(' ')[0], ['YYYY:MM:DD'])
						        const year = moment(date, ['YYYY:MM:DD']).format('YYYY')
						        const month = moment(date).format('MMMM')
						        const destination = _this.getDestination(dir, year, month)

	    			            // console.log("this image would go to: ", destination)
	    			            _this.moveFile(file, image_path, destination)  

				        	} else {
				        		_this.moveToUnknowns(dir, file)
				        	}
					       

				        }
				    })
				} catch(err){
					console.log(err)
				}  
			} else {
				console.log("not an image: ", file)
			}

		})
	},

	formatDirectoryPath(directory){
		let dir = _.clone(directory)

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
			fs.rename(image_path, destination, function (error) {
				if(error)	
					console.log(error)
			})	
		} else {
			destination = destination + '-dupe'
			fs.rename(image_path, destination, function (error) {
				if(error) 
					console.log(error)
			})	
		}

	},

	moveToUnknowns(directory, file_name){
		const destination = this.setupDirectory(directory, 'Unknowns')
		const image_path = directory + file_name
		this.moveFile(file_name, image_path, destination)
	},

	sayHello(){
		console.log("Hello!")
	}
}
