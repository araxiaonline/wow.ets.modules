# wow.ets.modules
This is a repo with modules built on top of [ETS Module](https://github.com/araxiaonline/wow-eluna-ts-module). 

In order to use these modules you will need to have: 
* Node 18+ installed
* NPM installed
* ETS installed in the repo you intend to transpiles the modules in. 
* AzerothCore Server with mod_eluna installed. 

If using AIO based modules then you will need to additionally install 
[Rochet2 AIO](https://github.com/Rochet2/AIO) 

> [!TIP]
> **What is AIO?**
> AIO is libary that allows messaging from the core server and game client.  This allows developers to build and deploy server side UI changes as if they were AddOns without requiring a user to install anything.  Modules in this repo that have __.client__ and __.server__ are AIO based modules. 

## Getting started
Since there are multiple modules available there are multiple approaches you can take to managing and deploying them. You can find the complete current list of supported modules here: [Module Registry](modules/index.md)

### Option 1
Single Module Manual Copy: 
1. You would clone this repo 
2. cd into the module you want to use
3. copy/paste code into your personal ets project. 
4. npm run build 
5. copy generated lua directories into your server eluna scripts directory. 
6. Run gm command or server command on your server .reload eluna

### Option 2 
MonoRepo Style Manual Copy
1. clone repo
2. npm install 
3. npm run build
4. copy functions.lib and any module dictories you want to use to your server. 

### Option 3 
Managed Deploy - 
1. clone repo
2. npm install 
3. delete any modules you do not want. 
4. add server SSH information to ets.env
5. use following command to build:
```bash
npm run build && npx ets deploy -e prod 
```

The distribution system is basic right now and a WIP, over the next few months there will be an "npm inspired" publish and install commands added to ets that will module management. 

## Module Requirements
Many time scripts require more than just code in order to perform a useful function.  More often that not, these are database updates.  

Modules can have other requirements that are necessary to make a module work. These requirements will be commented in the top of the file. 

The following are standard comments you can expect to see

* REQUIRES SQL - This module has a SQL file that needs to run before installation. 
* REQUIRES PATCH FILE - This module has client dependencies that must be installed in order to function
* REQUIRES [MOD_NAME] - An azerothcore module is required to enable functionality required for this module to work. 
* REQUIRES AIO - This module requires AIO to be installed in order to function. 
* REQUIRES SHARED - This module requires common functionlity from the "classes" folder

## SQL Files 
SQL files will be placed at the root of the repository and matching the same folder structure of the modules.  The folder will also mirror how azeroth core stores their sql changes splitting sql files into the respective database files. 

In example:

A file that addes a new item to the database for achievement tokens would be found at
```
SQL/gameplay/achievement-tokens/db_world/achievement-tokens.sql
```

>[!TIP]
> Azerothcore uses db_world, db_character_db_auth that relates to the databases in MySQL acore_world, acore_character, acore_auth, respectively. 

## Patch files
Patch files should be located in the same directory of the module that requires it. Additional instructions concerning the contents of the patch should be added to the README.md

## Required Lua Functions
When ETS builds modules it will create 2 additional libarary files that need to be installed at the root of the Azerothcore Eluna Scripts folder. 

```
common/
-- functions.lua
-- lualib_bundle.lua
```
> [!NOTE]
> default installation folder for eluna is lua_scripts typically on the root folder your azerothcore installation. 

## Contributing
We view this repository as a registry for ETS modules and encourage pull requests to the repo with new content. Our goal is to attempt to make it easy to distribute custom modules and build a large library of custom content and features.  

Please make sure to include good documentation in READMEs for functionality and details in PR. 