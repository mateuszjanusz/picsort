const fs = require('fs')
const ExifImage = require('exif').ExifImage
const moment = require('moment')
const _ = require('lodash')
const testFolder = './test_images/'

module.exports = {

	sortImages(directory) {
		const _this = this

		const dir = _this.formatDirectoryPath(directory)

		fs.readdirSync(dir).forEach(file => {
			const is_image = _.endsWith(file, 'jpg') || _.endsWith(file, 'png') || _.endsWith(file, 'jpeg')
			
			if(is_image){
				try {
					new ExifImage({ image : dir + file }, function (error, exifData) {
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

	    			            console.log("this image would go to: ", destination)
	    			            _this.copyFile(file, destination)
	    			            

				        	} else {
				        		_this.moveToUnknowns(dir)
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
		const dir = this.formatDirectoryPath(directory)

		const dir_path = dir + name

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

	copyFile(file, destination){
		destination = this.formatDirectoryPath(destination)
		destination = destination + file

		if(!fs.existsSync(destination)){

		} else {
			destination = destination + '_copy'
		}

	},
	// function copyFile(source, target, cb) {
	//   var cbCalled = false;

	//   var rd = fs.createReadStream(source);
	//   rd.on("error", function(err) {
	//     done(err);
	//   });
	//   var wr = fs.createWriteStream(target);
	//   wr.on("error", function(err) {
	//     done(err);
	//   });
	//   wr.on("close", function(ex) {
	//     done();
	//   });
	//   rd.pipe(wr);

	//   function done(err) {
	//     if (!cbCalled) {
	//       cb(err);
	//       cbCalled = true;
	//     }
	//   }
	// }

	moveToUnknowns(directory){
		this.setupDirectory(directory, 'Unknowns')
	}

}

