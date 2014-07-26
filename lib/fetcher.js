var fetchUrl = require("fetch").fetchUrl;

var gitRaw = "https://raw.githubusercontent.com/"

function FetcherConstructor() {}

var Fetcher = FetcherConstructor.prototype;

Fetcher.fetchVagrantYaml = function(owner, repo, callback) {
	var url = gitRaw + owner + "/" + repo + "/master/.vagrant.yml";
	console.log('.vagrant.yml url ' + url);
	fetchUrl(url, this.fetch.bind(this, callback));
}

Fetcher.fetchVGitYaml = function(owner, repo, callback) {
	var url = gitRaw + owner + "/" + repo + "/master/.vgit.yml";
	console.log('.vgit.yml url ' + url);
	fetchUrl(url, this.fetch.bind(this, callback));
}

Fetcher.fetch = function(callback, error, meta, body) {
	callback(body.toString());
} 

module.exports = Fetcher;