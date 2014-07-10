#vagrant-git

A very thiny nodejs script that perform a git sync (menas if pproject not checkout before than git clone othwerwise git pull) on the main project and depends on the file vagrant.yml it also perform git sync on the related vagrant git project and after all is fetched from git it can perform vagrant up or provision.

##Requirements
* installed git command
* installed vagrant command
* installed vm provider depends on the vagrant box (for example virtualbox)

##Operating Systems

Tested on
* Windows 7

##Install

```bash
npm install -g vagrant-git
```

##Usage

```bash
vgit [options]
Usage options 
--o (for differennt output folder than working dir optional)  
--repo (owner/repo for example pussinboots/vagrant-git mandatory) 
--up (to perform vagrant up default command optional) 
--prov (to perform vagrant provision optional)
```

For example to check out [softcover fork](https://github.com/pussinboots/softcover) and start a virtual box for it perform.
```bash
vgit --repo pussinboots/softcover --up
```

The --up command is optional the default vagrant command is up if no other is specified.
