const fs = require('fs')
const ExifImage = require('exif').ExifImage
const testFolder = './test_images/'

const file_names = []

fs.readdirSync(testFolder).forEach(file => {
	new ExifImage({ image : testFolder + file }, function (error, exifData) {
        if (error) console.log(error)
        else {
        	const exif = exifData.exif
        	const image_data = exifData.image

        	const image_timespan = exif.DateTimeOriginal || exif.CreateDate || image_data.ModifyDate
        	
            console.log(image_timespan)
        }
    })
})
