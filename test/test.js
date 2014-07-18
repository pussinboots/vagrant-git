var Process = require('../main.js');
var fs = require('fs');
var should = require('should');
var assert = require('assert');

describe('vgit main', function() {
  	describe('git', function() {
 	    it('should checkout vagrant-git project and vagrant-devel-full', function(done){
        	Process().perform({g:"https",reponum:0}, "pussinboots", "vagrant-git", "echo 'start vagrant'", function(code, env, workingDirectory) {
	          should(code).eql(0,'should have exit code zero');
	          should(fs.existsSync("./vagrant-devel-full")).eql(true, "vagrant-devel-full folder should exists");
	          should(fs.existsSync("./vagrant-devel-full/project/vagrant-git")).eql(true, "vagrant-devel-full/project/vagrant-git folder should exists");
	          done();
        	});
	    });

	     it('the fetched project should contain the .vagrant.yml file that defines which vagrant github repo should be used to start vagrant', function(done){
        	Process().perform({g:"https",reponum:0}, "pussinboots", "vagrant-git", "echo 'start vagrant'", function(code, env, workingDirectory) {
        	  should(workingDirectory).eql('./vagrant-devel-full', 'working directory for vagrant should be fetched vagrant project here ./vagrant-devel-full');
     	  	  should(fs.existsSync(workingDirectory + "/project/vagrant-git/.vagrant.yml")).eql(true, "/project/vagrant-git/.vagrant.yml ");
	          done();
        	});
	    });
	});
	describe('vagrant', function() {
 	    it('should passing projectDependencies as environment variable to vagrant that are defined in the project .vagrant.yml file', function(done){
        	Process().perform({g:"https",reponum:0}, "pussinboots", "vagrant-git", "echo 'start vagrant'", function(code, env, workingDirectory) {
        	  should(env.projectDependencies).eql('java8;sublime3;sbt;rpm;createrepo', 'should have exit code zero');
	          done();
        	});
	    });

	    it('should call vagrant in the fetched vagrant directory here ./vagrant-devel-full in this folder the Vagrantfile should exists', function(done){
        	Process().perform({g:"https",reponum:0}, "pussinboots", "vagrant-git", "echo 'start vagrant'", function(code, env, workingDirectory) {
        	  should(workingDirectory).eql('./vagrant-devel-full', 'working directory for vagrant should be fetched vagrant project here ./vagrant-devel-full');
     	  	  should(fs.existsSync(workingDirectory + "/Vagrantfile")).eql(true, "Vagrantfile should exists in the vagrant project folder needed to startup vagrant");
	          done();
        	});
	    });
	});
});