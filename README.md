#vagrant-git

A very thiny nodejs script that perform a git sync (means perform git clone or git pull depends if the project folder exists on the local machine) on the main project and depends on the file vagrant.yml it also perform git sync on the related vagrant git project and after all is fetched from git than it perform vagrant up or provision.

##Requirements
* installed git command
* installed vagrant command
* installed vm provider depends on the vagrant box (for example virtualbox)

##Recommended
* [vbguest](https://github.com/dotless-de/vagrant-vbguest) vagrant plugin to automaticly install virtualbox guest extension

Install it in vagrant with ```vagrant plugin install vagrant-vbguest``` no configuration needed will install the actual virtualbox guest extension if they not already installed in the vm image.

##Operating Systems

Tested on
* Windows 7

##Todo
* link the fetched github project to the vagrant box (no idea at the moment)

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

The main software project should contain the .vagrant.yml file on the project root like [softcover fork](https://github.com/pussinboots/softcover).
```yml
repo: pussinboots/vagrant-devel
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
C:\Users\frank\Downloads\vagrant-git>node bin/vgit.js --g https --repo pussinboots/softcover
options:  { _: [], g: 'https', repo: 'pussinboots/softcover' }
repo mode
owner pussinboots repo softcover
default command vagrant up
####################### git output ##########################
git pull on softcover project
git pull on vagrant-devel vagrant project
#############################################################
##################### vagrant project info ##################
provision: shell

description: Ubuntu 14.04 Desktop version that install all development tools wit
h an provisioner shell script.

hint: The first run of the provioner script with vagrant up will fail because or
acle 8 jdk installation needs user interaction so if the virtualbox is started l
ogin and perform sudo apt-get -f install than wait until this installation is fi
nished and start provision again with vgit --repo (project repo) --prov. To use
npm perform su -l vagrant on the terminal.

username: vagrant

password: vagrant

start vagrant up in folder vagrant-devel
################ vagrant process output #####################
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Box 'pussinboots/ubuntu-truly' could not be found. Attempting to fi
nd and install...
    default: Box Provider: virtualbox
    default: Box Version: >= 0
==> default: Loading metadata for box 'pussinboots/ubuntu-truly'
    default: URL: https://vagrantcloud.com/pussinboots/ubuntu-truly
The box you're attempting to add doesn't support the provider
you requested. Please find an alternate box or use an alternate
provider. Double-check your requested provider to verify you didn't
simply misspell it.
...
..
.
```
Is not the complete output here it should give you a example output.
