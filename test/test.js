const picsort = require('../lib/picsort')
const assert = require('assert')
const chai = require('chai')
const expect = chai.expect

describe('picsort', function() {

	describe('exists()', function() {
	    it('should return true when directory exists', function() {
	     	const result = picsort.exists('./test/owl.jpg')
	     	expect(result).to.be.true
	    })
	    it('should return false when directory does not exists', function() {
	     	const result = picsort.exists('folder')
	     	expect(result).to.be.false
	    })
	})

	describe('formatDirectoryPath()', function() {
	    it('should add "/" at the end of the string', function() {
	     	const result = picsort.formatDirectoryPath('new_dir')
	     	expect(result).to.be.equal('new_dir/')
	    })
	    it('should return original string if it already contains "/"', function() {
	     	const result = picsort.formatDirectoryPath('new_dir/')
	     	expect(result).to.be.equal('new_dir/')
	    })
	    
	})

	describe('setupDirectory()', function() {
	    it('should create new directory called "test"', function() {
	     	const dir = picsort.setupDirectory('./test', 'test_directory')
	     	const result = picsort.exists(dir)
	     	expect(result).to.be.true
	    })
	})

	describe('getDestination()', function() {
	    it('should return a destination that already exists', function() {
	     	const dir = picsort.getDestination('./test', 'test_directory')
	     	const result = picsort.exists(dir)
	     	expect(result).to.be.true
	    })
	    it('should setup and return a new year destination', function() {
	     	const dir = picsort.getDestination('./test', 2017)
	     	const result = picsort.exists(dir)
	     	expect(result).to.be.true
	    }) 

	    it('should setup and return a new year/month destination', function() {
	     	const dir = picsort.getDestination('./test', 2017, '01-January')
	     	const result = picsort.exists(dir)
	     	expect(result).to.be.true
	    }) 

	    it('should setup and return a new year/month/day destination', function() {
	     	const dir = picsort.getDestination('./test', 2017, '01-January', '01')
	     	const result = picsort.exists(dir)
	     	expect(result).to.be.true
	    })
	})

	describe('moveFile()', function() {
	    it('should move the file to new destination', function() {
	     	picsort.moveFile('owl.jpg', './test/owl.jpg', './test/2017/')
	     	const result = picsort.exists('./test/2017/owl.jpg')
	     	expect(result).to.be.true
	    })

	    it('should move the file and rename the file if already exists', function() {
	     	picsort.moveFile('owl.jpg', 'test/2017/owl.jpg', './test/2017/')
	     	const result = picsort.exists('test/2017/dupe-owl.jpg')
	     	expect(result).to.be.true
	    })


	})

})
