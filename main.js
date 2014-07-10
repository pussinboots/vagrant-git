var git  = require('gift');
var yaml = require('yamljs');

var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var repoFolder = "./";

function fetchRepo(owner, repo, callback) {
	if (fs.existsSync(repoFolder +repo)) {
		console.log('git pull on ' + repo);
		var repository = git(repoFolder+repo);
    	repository.pull('master', function(err, _repo) {
    		if(err) sys.puts(err);
    		if(callback)
    			callback(repo)
	  	})
	} else {
		console.log('git clone https://github.com/' + owner + '/' + repo);
		git.clone("https://github.com/" + owner+ "/" + repo, repo, function(err, _repo) {
			if(err) sys.puts(err);
			if(callback)
    			callback(repo)
	  	})
  	}	
}

function getVagrantRepo(repo, format) {
	var vagrantYml = yaml.load(repoFolder+repo +'/vagrant.yml');
	var vagrantRepo = vagrantYml.repo;
	return {owner:vagrantRepo.split('/')[0], repo:vagrantRepo.split('/')[1]};
}

function perform(owner, repo, vagrantCmd) {
	fetchRepo(owner, repo, function(repo) {
		var vagrantRepo = getVagrantRepo(repo);
		fetchRepo(vagrantRepo.owner, vagrantRepo.repo, function(repo){
			var vagrant = exec("vagrant " + vagrantCmd,{cwd: repoFolder +repo, maxBuffer: 1024*1024}, function (error, stdout, stderr) { 			
			});
			//FIXME added file log
			vagrant.stdout.on('data', function(data) { process.stdout.write(data); });
			vagrant.stderr.on('data', function(data) { process.stderr.write(data); });
			vagrant.on('close', function(code) { console.log('closing code: ' + code); });
		});
	});
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
		if (options.up) {
			console.log('vagrant up');
			perform(owner, repo, "up");
		} else if (options.prov) {
			console.log('vagrant provision');
			perform(owner, repo, "provision");
		} else {
			console.log('default command vagrant up');
			perform(owner, repo, "up");
		}
	} else {
		console.log('Usage options \n--o (for differennt output folder than working dir optional)  \n--repo (owner/repo for example pussinboots/vagrant-git mandatory) \n--up (to perform vagrant up default command optional) \n--prov (to perform vagrant provision optional)');
	}
}
module.exports = Cli;