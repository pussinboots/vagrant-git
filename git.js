var git  = require('gift');
var fs = require('fs');
var sys = require('sys');

var repoFolder = "./";
var gitProtocolHttps="https://github.com/"
var gitRaw = "https://raw.githubusercontent.com/"
var gitProtocolGit="git@github.com:"

function Git(_options) {
	this.options = _options;
}

var Clazz = Git.prototype;

Clazz.getGitProtocol = function () {
	if (this.options.g)
		if(this.options.g === "git")
			return gitProtocolGit;
		else if(this.options.g === "https")
			return gitProtocolHttps;
	return gitProtocolGit;
}

Clazz.fetchRepo = function (owner, repo, outputDir, type, callback) {
	if (fs.existsSync(repoFolder+ outputDir + '/' +repo)) {
		console.log('git pull on ' + outputDir + '/' + repo + ' ' + type);
		var repository = git(repoFolder + outputDir + '/' + repo);
    	repository.pull('master', function(err, _repo) {
    		if(err) sys.puts(err);
    		if(callback)
    			callback(repo)
	  	})
	} else {
		console.log('git clone ' + this.getGitProtocol(this.options) + owner + '/' + repo + ' ' + type + ' into ' + outputDir + '/' + repo);
		var cloneProcess = git.clone(this.getGitProtocol(this.options)+ owner+ "/" + repo, outputDir + '/' + repo, function(err, _repo) {
			if(err) sys.puts(err);
			if(callback)
    			callback(repo)
	  	})
  	}	
}

Clazz.fetchRepos = function(vagrantCmd, vagrantRepo, owner, repo, env, finish, callback) {
	var self = this;
	this.fetchRepo(vagrantRepo.owner, vagrantRepo.repo, '.', 'vagrant project', function(_repo) {
		self.fetchRepo(owner, repo, vagrantRepo.repo + "/project", 'project', function(_repo){
			callback(vagrantCmd, vagrantRepo, owner, repo, env, finish)
		});
	});	
}

module.exports = Git;