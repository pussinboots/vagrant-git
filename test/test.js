var Process = require('../main.js');
var fs = require('fs');
var should = require('should');
var assert = require('assert');

describe('vgit', function() {
  	describe('git', function() {
 	    it('should checkout vagrant-git project and vagrant-devel-full', function(done){
        	Process().perform({g:"https",reponum:0}, "pussinboots", "vagrant-git", "echo 'start vagrant'", function(code, env) {
	          should(code).eql(0,'should have exit code zero');
	          should(fs.existsSync("./vagrant-devel-full")).eql(true, "vagrant-devel-full folder should exists");
	          should(fs.existsSync("./vagrant-devel-full/project/vagrant-git")).eql(true, "vagrant-devel-full/project/vagrant-git folder should exists");
	          done();
        	});
	    });
	});
	describe('vagrant', function() {
 	    it('should passing projectDependencies as environment variable to vagrant that are defined in the project .vagrant.yml file', function(done){
        	Process().perform({g:"https",reponum:0}, "pussinboots", "vagrant-git", "echo 'start vagrant'", function(code, env) {
	          should(env.projectDependencies).eql('java8;sublime3;sbt;rpm;createrepo', 'should have exit code zero');
	          done();
        	});
	    });
	});
});