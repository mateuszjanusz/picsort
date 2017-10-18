const picsort = require('./lib/picsort')
const test_path = './test_images/'
const assert = require('assert')
const chai = require('chai')
const expect = chai.expect

describe('picsort', function() {

	describe('function exists', function() {
	    it('should return true when directory exists', function() {
	     	const result = picsort.exists('test.js')
	     	expect(result).to.be.true
	    })
	    it('should return false when directory does not exists', function() {
	     	const result = picsort.exists('folder')
	     	expect(result).to.be.false
	    })
	})

	describe('function formatDirectoryPath', function() {
	    it('should add "/" at the end of the string', function() {
	     	const result = picsort.formatDirectoryPath('new_dir')
	     	expect(result).to.be.equal('new_dir/')
	    })
	    it('should return original string if it already contains "/"', function() {
	     	const result = picsort.formatDirectoryPath('new_dir/')
	     	expect(result).to.be.equal('new_dir/')
	    })
	    
	})

})
