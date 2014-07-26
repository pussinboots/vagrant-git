var Cli = require('../lib/cli.js')
var fs = require('fs');
var should = require('should');
var assert = require('assert');

describe('vgit', function() {
  	describe('cli', function() {
 	    it('should checkout vagrant-git project and vagrant-devel-full', function(done){
 	    	Cli(['test', './', '--g', 'https', '--repo', 'pussinboots/vagrant-git', '--reponum', '0','--echo'], function(code, env) {
	          should(code).eql(0,'should have exit code zero');
	          should(fs.existsSync("./vagrant-devel-full")).eql(true, "vagrant-devel-full folder should exists");
	          should(fs.existsSync("./vagrant-devel-full/project/vagrant-git")).eql(true, "vagrant-devel-full/project/vagrant-git folder should exists");
	          done();
        	});
	    });
	});
});
