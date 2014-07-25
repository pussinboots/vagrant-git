var Fetcher = require('../fetcher.js')
var should = require('should');
var assert = require('assert');

describe('vgit', function() {
  	describe('fetcher', function() {
 	    it('should fetch .vagrant.yml file', function(done){
 	    	Fetcher.fetchVagrantYaml("pussinboots", "vagrant-git", function(body) {
 	    		body.should.startWith('repo');
 	    		done();
 	    	})
	    });
	    it('should fetch .vgit.yml file', function(done){
 	    	Fetcher.fetchVGitYaml("pussinboots", "vagrant-devel", function(body) {
 	    		body.should.startWith('description');
 	    		done();
 	    	})
	    });
	});
});
