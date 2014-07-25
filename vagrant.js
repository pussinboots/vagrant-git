var sys = require('sys');
var exec = require('child_process').exec;
var yaml = require('yamljs');

var Fetcher = require("./fetcher");

var repoFolder = "./";

function Vagrant(_vagrantCmd, _env) {
	this.vagrantCmd = _vagrantCmd;
	this.env = _env;
}

var Clazz = Vagrant.prototype;

Clazz.getVGitYml = function(repo) {
	return yaml.load(repoFolder + repo +'/.vgit.yml');
}

Clazz.displayVGitYmlFromUrl = function(repoNumber, owner, repo) {
	Fetcher.fetchVGitYaml(owner, repo, function(body){
	    console.log('\nRepo: '+ ' ' + repoNumber + ' ' +owner+'/'+repo+' \n' + body.toString());
	});
}
		
Clazz.displayVGitYml = function(repo) {
	var vgitYml = this.getVGitYml(repo);
	if (vgitYml.provision) console.log('provision: ' + vgitYml.provision + '\n')
	if (vgitYml.description) console.log('description: ' + vgitYml.description + '\n')
	if (vgitYml.hint) console.log('hint: ' + vgitYml.hint + '\n')
	if (vgitYml.username) console.log('username: ' + vgitYml.username + '\n')
	if (vgitYml.password) console.log('password: ' + vgitYml.password + '\n')
	if (vgitYml.size) console.log('size: ' + vgitYml.size + '\n')
	if (vgitYml.image) console.log('image: ' + vgitYml.image + '\n')
}

Clazz.vagrant = function(vagrantRepo, projectRepo, finish) {
	var self = this;
	console.log('#############################################################');
	console.log('##################### vagrant project info ##################');
	this.displayVGitYml(vagrantRepo.repo);
	console.log(this.vagrantCmd + ' in folder ' + projectRepo.repo);
	console.log('################ vagrant process output #####################');
	var workingDirectory = repoFolder + vagrantRepo.repo;
	var vagrant = exec(this.vagrantCmd,{cwd: workingDirectory, maxBuffer: 1024*1024, env:this.env}, function (error, stdout, stderr) { 			
	});
	//FIXME added file log
	vagrant.stdout.on('data', function(data) { process.stdout.write(data); });
	vagrant.stderr.on('data', function(data) { process.stderr.write(data); });
	vagrant.on('close', function(code) { 
		console.log('##############################################################');
		console.log('closing code: ' + code);
		finish(code, self.env, workingDirectory);
	});
}

module.exports = Vagrant;