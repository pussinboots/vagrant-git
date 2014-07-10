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
	  		
	  	})
  	}	
}

function getVagrantRepo(repo, format) {
	var vagrantYml = yaml.load(repoFolder+repo +'/vagrant.yml');
	var vagrantRepo = vagrantYml.repo;
	return {owner:vagrantRepo.split('/')[0], repo:vagrantRepo.split('/')[1]};
}

function validateFormat(request, callback) {
	var format = FORMATS[request.parameters.format];
	if(!format) {
		 var error = new Error('invalid format: valid fomarts are pdf, epub, mobi or html.');
	     error.statusCode = 400;
	     return callback( error );
	}
	return format;
}

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
var owner = myArgs[0].split('/')[0]
var repo = myArgs[0].split('/')[1]
console.log('owner ' + owner + ' repo ' + repo);
fetchRepo(owner, repo, function(repo) {
	var vagrantRepo = getVagrantRepo(repo);
	fetchRepo(vagrantRepo.owner, vagrantRepo.repo);
});