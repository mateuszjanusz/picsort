const Picsort = require('./lib/index')
const test_path = './test_images/'



const path_to_images = process.argv[2] || test_path

Picsort.sortImagesByDate(path_to_images)
