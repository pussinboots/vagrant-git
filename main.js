var prompt = require('prompt');
var git  = require('gift');
var yaml = require('yamljs');
var fetchUrl = require("fetch").fetchUrl;
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

var repoFolder = "./";
var gitProtocolHttps="https://github.com/"
var gitRaw = "https://raw.githubusercontent.com/"
var gitProtocolGit="git@github.com:"

function getGitProtocol(options) {
	if (options.g)
		if(options.g === "git")
			return gitProtocolGit;
		else if(options.g === "https")
			return gitProtocolHttps;
	return gitProtocolGit;
}

function fetchRepo(options, owner, repo, outputDir, type, callback) {
	if (fs.existsSync(repoFolder+ outputDir + '/' +repo)) {
		console.log('git pull on ' + outputDir + '/' + repo + ' ' + type);
		var repository = git(repoFolder + outputDir + '/' + repo);
    	repository.pull('master', function(err, _repo) {
    		if(err) sys.puts(err);
    		if(callback)
    			callback(repo)
	  	})
	} else {
		console.log('git clone ' + getGitProtocol(options) + owner + '/' + repo + ' ' + type + ' into ' + outputDir + '/' + repo);
		var cloneProcess = git.clone(getGitProtocol(options)+ owner+ "/" + repo, outputDir + '/' + repo, function(err, _repo) {
			if(err) sys.puts(err);
			if(callback)
    			callback(repo)
	  	})
  	}	
}

function getVagrantRepo(repo) {
	var vagrantYml = yaml.load(repoFolder+repo +'/.vagrant.yml');
	var vagrantRepo = vagrantYml.repo;
	return {owner:vagrantRepo.split('/')[0], repo:vagrantRepo.split('/')[1]};
}

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

function getVGitYml(repo) {
	return yaml.load(repoFolder+repo +'/.vgit.yml');
}

function displayVGitYmlFromUrl(repoNumber, owner, repo) {
	var url = gitRaw + owner + "/" + repo + "/master/.vgit.yml";
	console.log('.vgit.yml url ' + url);
	fetchUrl(url, function(error, meta, body){
	    console.log('\nRepo: '+ ' ' + repoNumber + ' ' +owner+'/'+repo+' \n' + body.toString());
	});
}
		
function displayVGitYml(repo) {
	var vgitYml = getVGitYml(repo);
	if (vgitYml.provision) console.log('provision: ' + vgitYml.provision + '\n')
	if (vgitYml.description) console.log('description: ' + vgitYml.description + '\n')
	if (vgitYml.hint) console.log('hint: ' + vgitYml.hint + '\n')
	if (vgitYml.username) console.log('username: ' + vgitYml.username + '\n')
	if (vgitYml.password) console.log('password: ' + vgitYml.password + '\n')
	if (vgitYml.size) console.log('size: ' + vgitYml.size + '\n')
	if (vgitYml.image) console.log('image: ' + vgitYml.image + '\n')
}

function Process() {
	return{
		perform: function(options, owner, repo, vagrantCmd, finish) {
			console.log('####################### git output ##########################');
			var url = gitRaw + owner + "/" + repo + "/master/.vagrant.yml"
			console.log('.vagrant.yml url ' + url);
			fetchUrl(url, function(error, meta, body){
				console.log('####################### .vagrant.yml content ##########################');
			    console.log(body.toString());
				console.log('###################################################################');
				getVagrantRepoFromString(options, body.toString(), function(vagrantRepo) {
					var env = process.env;
					console.log('####################### provision dependencies ##########################');
					if (vagrantRepo.yaml.deps) {
						env.projectDependencies = vagrantRepo.yaml.deps.join(';');
						console.log('run provision for: ' + vagrantRepo.yaml.deps.join(';'));
					}
					else console.log('no provision dependencies specified');
					console.log('###################################################################');
					fetchRepo(options, vagrantRepo.owner, vagrantRepo.repo, '.', 'vagrant project', function(_repo) {
						fetchRepo(options, owner, repo, vagrantRepo.repo + "/project", 'project', function(_repo){
							console.log('#############################################################');
							console.log('##################### vagrant project info ##################');
							displayVGitYml(vagrantRepo.repo);
							console.log('start vagrant ' + vagrantCmd + ' in folder ' + repo);
							console.log('################ vagrant process output #####################');
							var vagrant = exec(vagrantCmd,{cwd: repoFolder + vagrantRepo.repo, maxBuffer: 1024*1024, env:env}, function (error, stdout, stderr) { 			
							});
							//FIXME added file log
							vagrant.stdout.on('data', function(data) { process.stdout.write(data); });
							vagrant.stderr.on('data', function(data) { process.stderr.write(data); });
							vagrant.on('close', function(code) { 
								console.log('##############################################################');
								console.log('closing code: ' + code);
								finish(code, env);
							});
						});
					});
				});
			});
		}
	}
}

function Cli(argv) {
	var options = require('minimist')(argv.slice(2));
	console.log('options: ', options);
	if (options.o) {
		repoFolder=options.o
	}
	if (options.repo) {
		console.log('repo mode');
		var owner = options.repo.split('/')[0]
		var repo = options.repo.split('/')[1]
		console.log('owner ' + owner + ' repo ' + repo);
		if (options.reponum) {
			//todo implemnet passing repo number so that the prompt will not occur
		}
		if (options.up) {
			console.log('vagrant up');
			Process().perform(options, owner, repo, "vagrant up", function(code, env){});
		} else if (options.prov) {
			console.log('vagrant provision');
			Process().perform(options, owner, repo, "vagrant provision", function(code, env){});
		} else {
			console.log('default command vagrant up');
			Process().perform(options, owner, repo, "vagrant up", function(code, env){});
		}
	} else {
		console.log('Usage options \n--g (https or git protocol git is default)\n--o (for differennt output folder than working dir optional)  \n--repo (owner/repo for example pussinboots/vagrant-git mandatory) \n--up (to perform vagrant up default command optional) \n--prov (to perform vagrant provision optional)');
	}
}
module.exports = Cli;
module.exports = Process;