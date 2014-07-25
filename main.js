var prompt = require('prompt');
var yaml = require('yamljs');

var Fetcher = require("./fetcher");
var Git  = require('./git');
var Vagrant = require("./vagrant");

var repoFolder = "./";

function getVagrantRepoFromString(options, ymlStr, callback) {
	var vagrantYml = yaml.parse(ymlStr);
	var vagrantRepo = vagrantYml.repo;
	if (typeof vagrantRepo === 'object') {
		if(options.reponum >= 0) {
			return callback({owner:vagrantRepo[options.reponum].split('/')[0], repo:vagrantRepo[options.reponum].split('/')[1], yaml: vagrantYml});
		}
		for(var i=0; i < vagrantRepo.length; i++) {
			displayVGitYmlFromUrl(i, vagrantRepo[i].split('/')[0], vagrantRepo[i].split('/')[1]);
		}
		prompt.start();
		prompt.resume();
		prompt.get(['repoNumber'], function (err, result) {
			if (err) { return onErr(err); }
			console.log('Command-line input received:');
			console.log('choose Repo:' + result.repoNumber);
			callback({owner:vagrantRepo[result.repoNumber].split('/')[0], repo:vagrantRepo[result.repoNumber].split('/')[1], yaml: vagrantYml});
		});

		function onErr(err) {
			console.log(err);
			return 1;
		}
	} else {
		callback({owner:vagrantRepo.split('/')[0], repo:vagrantRepo.split('/')[1], yaml: vagrantYml});
	}
}

function displayVGitYmlFromUrl(repoNumber, owner, repo) {
	Fetcher.fetchVGitYaml(owner, repo, function(body){
	    console.log('\nRepo: '+ ' ' + repoNumber + ' ' +owner+'/'+repo+' \n' + body.toString());
	});
}

function gitAndVagrant(body, options, owner, repo, vagrantCmd, finish) {
	console.log('####################### .vagrant.yml content ##########################');
    console.log(body);
	console.log('###################################################################');
	getVagrantRepoFromString(options, body, function(vagrantRepo) {
		var env = process.env;
		console.log('####################### provision dependencies ##########################');
		if (vagrantRepo.yaml.deps) {
			env.projectDependencies = vagrantRepo.yaml.deps.join(';');
			console.log('run provision for: ' + vagrantRepo.yaml.deps.join(';'));
		}
		else console.log('no provision dependencies specified');
		console.log('###################################################################');
		console.log(Git);
		var GitHelper = new Git(options);
		GitHelper.fetchRepos(vagrantCmd, vagrantRepo, {owner:owner, repo:repo}, env, finish, startVagrant);
	});	
}

function startVagrant(vagrantCmd, vagrantRepo, projectRepo, env, finish) {
	var VagrantHelper = new Vagrant(vagrantCmd, env);
	VagrantHelper.vagrant(vagrantRepo, projectRepo, finish);
}

function Process() {
	return{
		perform: function(options, owner, repo, vagrantCmd, finish) {
			console.log('####################### git output ##########################');
			Fetcher.fetchVagrantYaml(owner, repo, function(body){
				gitAndVagrant(body, options, owner, repo, vagrantCmd, finish);
			});
		}
	}
}

module.exports = Process;