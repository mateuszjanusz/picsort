const fs = require('fs')
const ExifImage = require('exif').ExifImage
const moment = require('moment')
const _ = require('lodash')
const testFolder = './test_images/'

module.exports = {

	sortImages(dir) {
		const _this = this

		if(!dir.charAt(dir.length-1).includes('/')){
			dir = dir + '/'
		}

		fs.readdirSync(dir).forEach(file => {
			const is_image = _.endsWith(file, 'jpg') || _.endsWith(file, 'png') || _.endsWith(file, 'jpeg')
			
			if(is_image){
				new ExifImage({ image : dir + file }, function (error, exifData) {
			        if (error) console.log(error)
			        else {
			        	const exif = exifData.exif
			        	const image_data = exifData.image

			        	const image_timespan = exif.DateTimeOriginal || exif.CreateDate || image_data.ModifyDate


				        const date = moment(image_timespan.split(' ')[0], ['YYYY:MM:DD'])
				        const year = moment(date, ['YYYY:MM:DD']).format('YYYY')
				        const month = moment(date).format('MMMM')

				        const destination = _this.createDirectory(dir, year, month)

			            console.log("this file should go to: ", destination)
			        }
			    })
			}

		})
	},

	createDirectory(dir, year, month) {
		const new_folder = dir + 'Sorted'

		if(!fs.existsSync(new_folder)){
			final_dir = new_folder
			fs.mkdirSync(new_folder)
		}

		const year_folder = new_folder + '/' + year
		if(!fs.existsSync(year_folder)){
			fs.mkdirSync(year_folder)
		}

		const month_folder = year_folder + '/' + month
		if(!fs.existsSync(month_folder)){
			fs.mkdirSync(month_folder)
		}

		return month_folder
	}

}

