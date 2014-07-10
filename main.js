var git  = require('gift');
var yaml = require('yamljs');

var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var repoFolder = "./";


function puts(error, stdout, stderr) { sys.puts(stdout) }

function fetchRepo(owner, repo, callback) {
	console.log("checkl if exists "+ repoFolder +repo);
	if (fs.existsSync(repoFolder +repo)) {
		console.log('git pull ' + repoFolder+'/'+repo);
		var repository = git(repoFolder+repo);
    	repository.pull('master', function(err, _repo) {
    		if(callback)
    			callback(repo)
	  	})
	} else {
		console.log('git clone clone https://github.com/' + owner + '/' + repo);
		git.clone("https://github.com/" + owner+ "/" + repo, repo, function(err, _repo) {
			sys.puts(err);
			sys.puts(_repo);
	  	})
  	}	
}

function getVagrantRepo(repo, format) {
	var vagrantYml = yaml.load(repoFolder+repo +'/vagrant.yml');
	var vagrantRepo = vagrantYml.repo;
	return {owner:vagrantRepo.split('/')[0], repo:vagrantRepo.split('/')[1]};
}

var argv = require('minimist')(process.argv.slice(2));
console.log('myArgs: ', argv);
if (argv.repo) {
	console.log('repo mode');
	var owner = argv.repo.split('/')[0]
	var repo = argv.repo.split('/')[1]
	console.log('owner ' + owner + ' repo ' + repo);
	fetchRepo(owner, repo, function(repo) {
		var vagrantRepo = getVagrantRepo(repo);
		fetchRepo(vagrantRepo.owner, vagrantRepo.repo, function(repo){
			var vagrant = exec("vagrant up",{cwd: repoFolder +repo}, function (error, stdout, stderr) { 
				sys.puts(stdout);
				sys.puts(stderr);
			});
			vagrant.stdout.on('data', function(data) { process.stdout.write(data); });
		});
	});
}

else if (argv.up) {
	console.log('vagrant up');
}
else if (argv.provision) {
	console.log('vagrant provision');
}
else if (argv.repo) {
}