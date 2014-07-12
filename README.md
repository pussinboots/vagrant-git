#vagrant-git

A very thiny nodejs script that perform a git sync (means perform git clone or git pull depends if the project folder exists on the local machine) on the main project and depends on the file vagrant.yml it also perform git sync on the related vagrant git project and after all is fetched from git than it perform vagrant up or provision.

##Requirements
* installed git command
* installed vagrant command
* installed vm provider depends on the vagrant box (for example virtualbox)
* __symlink support on shared folders [discussion](https://github.com/mitchellh/vagrant/issues/713) otherwise npm install for example will fail with an error message like__ ```npm ERR! Error: ENOENT, lstat '/vagrant/node-modules/grunt/node_modules/glob/examples/usr-local.js'``` if it is performed on the project folder inside the shared folder. In other words symlink could not be created in vagrant`s shared folder. 
    * solved on Windows 7 Host
      * run command line as administrator
      * or change npm install behavoir with npm install --no-bin-links [described here](https://github.com/npm/npm/issues/5482)
      * or copy the project out of the shared folder but than you lose the automatic git pull o

##Recommended
* [vbguest](https://github.com/dotless-de/vagrant-vbguest) vagrant plugin to automaticly install virtualbox guest extension

Install it in vagrant with ```vagrant plugin install vagrant-vbguest``` no configuration needed will install the actual virtualbox guest extension if they not already installed in the vm image.

##How it works

First run do git clone if the project exist locally than git pull is performed instead.

1. first look into the project .vagrant.yml file to resolve the vagrant github repo to clone
2. clone the vagrant github repo 
3. than clone the specified --repo (owner/repo) on the command line into the vagrant github repo /project/(project repo name)
4. Display content of the vagrant github repo file .vgit.yml
5. perform vagrant up or provision depends on the command options

Done

##Operating Systems

Tested on
* Windows 7

##Todo
* link the fetched github project to the vagrant box by perform git clone in the vagrant project folder that is automaticly shared by vagrant (done)
* the project could specify more than one vagrant repo so that the user can decide which one he wants two scenarios
    * complete vm image so no provisioner to run. Pros: faster to start Cons: bigger vm image to download
    * small vm image all dependencies or most are installed with a provisioner Pros: slower to start Cons: smaller vm image to download 
  (done)

##Install

```bash
npm install -g vagrant-git
```

##Usage

```bash
vgit [options]
Usage options 
--g (https or git protocol git is default)
--o (for differennt output folder than working dir optional)  
--repo (owner/repo for example pussinboots/vagrant-git mandatory) 
--up (to perform vagrant up default command optional) 
--prov (to perform vagrant provision optional)
```

For example to check out [softcover fork](https://github.com/pussinboots/softcover) and start a virtual box for it perform.
```bash
vgit --g https --repo pussinboots/softcover --up
```

The --up option is optional the default vagrant command is up if no other is specified.
The --g option is optional default is git and other value is https set the git protocol to use for git clone

##Version

* 0.0.2 3 hours of development and some error handling is missing also tests

##Project Configuration

The main software project should contain the .vagrant.yml file on the project root like [softcover-nonstop fork](https://github.com/pussinboots/softcover).
```yml
repo: pussinboots/vagrant-devel
```
or now it supports multiple repo defintion the user can choose one of them.
```yml
repo: 
    - pussinboots/vagrant-devel-full
    - pussinboots/vagrant-devel
```
At the moment it contains only one line that point to the vagrant box project at github like this project [vagrant-devel](https://github.com/pussinboots/vagrant-devel).
At the root path of the vagrant project there should exists a file called .vgit.yml.
```yml
description: Ubuntu 14.04 Desktop version that install all development tools with an provisioner shell script.
provision: shell
hint: The first run of the provioner script with vagrant up will fail because oracle 8 jdk installation needs user interaction so if the virtualbox is started login and perform sudo apt-get -f install than wait until this installation is finished and start provision again with vgit --repo (project repo) --prov. To use npm perform su -l vagrant on the terminal.
username: vagrant
password: vagrant
```
The content of this file will be display before vagrant command is performed so it should contains little description about the vagrant box maybe a hint that descripe steps they has to performed manual or given some advices. All fields are optionla but the file has to be exists at the moment. The field username and password should contains the used value for the vagrant box. That file will produce the following output at the command line. The different process outputs are separeted with a long line of # signs and the above values are display in the #################vagrant project info################ section to give the user some needful information. The below output is an example output on my Windows 7 machine. 
```bash
Z:\somewhere>node bin/vgit.js --g https --repo pussinboots/herok
u-softcover
options:  { _: [], g: 'https', repo: 'pussinboots/heroku-softcover' }
repo mode
owner pussinboots repo heroku-softcover
default command vagrant up
####################### git output ##########################
repo: pussinboots/vagrant-devel-full

git pull on /vagrant-devel-full vagrant project
From https://github.com/pussinboots/vagrant-devel-full
 * branch            master     -> FETCH_HEAD
error: Your local changes to the following files would be overwritten by merge:
        Vagrantfile
Please, commit your changes or stash them before you can merge.
Aborting

git pull on vagrant-devel-full/project/heroku-softcover project

#############################################################
##################### vagrant project info ##################
description: Ubuntu 14.04 Desktop version contains all development tools needed
for play 2.2.3, sbt 0.13.5 and nodejs ready to use.

hint: The oracle jdk 8 installation is full automated and accept the license aut
omated. To use npm perform su -l vagrant on the terminal. Maybe restart needed b
ecause new profile.d scripts will be added they take effect after restart.

username: vagrant

password: vagrant

start vagrant up in folder heroku-softcover
################ vagrant process output #####################
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Clearing any previously set forwarded ports...
==> default: Clearing any previously set network interfaces...
==> default: Preparing network interfaces based on configuration...
    default: Adapter 1: nat
==> default: Forwarding ports...
    default: 22 => 2222 (adapter 1)
==> default: Running 'pre-boot' VM customizations...
==> default: Booting VM...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
    default: Warning: Connection timeout. Retrying...
==> default: Machine booted and ready!
GuestAdditions 4.3.12 running --- OK.
==> default: Checking for guest additions in VM...
==> default: Mounting shared folders...
    default: /vagrant => F:/fit/workspace/vagrant-git/vagrant-devel-full
==> default: Machine already provisioned. Run `vagrant provision` or use the `--
provision`
==> default: to force provisioning. Provisioners marked to run always will still
 run.
##############################################################
closing code: 0
```
Is not the complete output here it should give you a example output.
