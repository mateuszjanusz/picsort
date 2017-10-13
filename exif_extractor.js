const ExifImage = require('exif').ExifImageg

try {
    new ExifImage({ image : 'test_images/test3.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: '+error.message)
        else
            console.log(exifData)
    });
} catch (error) {
    console.log('Error: ' + error.message)
}