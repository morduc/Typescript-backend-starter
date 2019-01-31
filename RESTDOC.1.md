# System Documentation

## Prerequisites
System has been tested and developed on a mac.
Install all hyperledger fabric depencies using this guide

https://hyperledger-fabric.readthedocs.io/en/release-1.3/prereqs.html

follow guidelines on this page, except set the GOPATH variable to the `Chaincode` folder to be able to do the tests

## Get the code
All code has been submitted with the project report.

## Configure the config files
You need to supply a couchdb compliant database for storing user credentials, cryptomaterials etc.

For the development and testing i have used a free cloudant database on ibm-cloud, which is available after creating a free account on ibm cloud

fill in hostname username password and urls in the schema below and copy it to the equivalent in the file

    Backend/src/config/Config.ts

and

    Blockchain-Management/tool/www/config/config.ts

``` javascript
    userStore: {
        name: "bachelor_dtu_user_db",
        host: "<HOST_NAME>",
        username: "<USER_NAME>",
        password: "<PASSWORD>"
    },

    stateStore:{
        name: "state_member_db",
        url: "<COUCH_DB_URL>"
    },

    caCryptoStore:{
        name: 'crypto_db',
        url: name: "<DATABASE_NAME>,
        url: "<COUCH_DB_URL>"
    },

    clientCryptoStore: {
        name: 'crypto_db',
        url: "<COUCH_DB_URL>"
    }
```


## First startup
  
open terminal
 Go into Network folder

run 

    sh build.sh firsttime build start

this will take several minutes

the process will build the docker images, and create the crypto material, and start the network.

## Copy the crypto material
We need to copy the crypto material to both the blockchain management tool and to the backend
This enables the mangement tool to push new chaincode to the network,

and allows the backend to communicate with the network

### Copy crypto material to blockchain management tool

Copy all files from the folder:

    Network/production/bachelor.dtu.org

 to folder

    Blockchain-Management/tool/resources/certs/bachelor.dtu.org

### Copy crypto material to Backend
Copy the following files

    Admin@public-key.pem
    orderer0.pem
    peer0.pem
    peer1.pem
    peer2.pem

from folder

    Network/production/bachelor.dtu.org

to folder

    Backend/resources/certs

## Pushing new chaincode to the network

After configuring the all of thhe above go into the folder

go to 

    Blockchain-Management/tool/www/config

and open the file `config.ts`

make sure that the chaincodes array have

    id: `c1`

    version: `v1`

each time we push a new version of the chaincode we need to increment the version

go to 

    Blockchain-Management/tool

and run the command

    npm start

this will install and instantiate the chaincode on the network

if a timeout error occurs, run the command again.

The blockchain network  is now up and running with the lates version of the chaincode


## Starting the backend

go into the folder

Backend/`

and run the command

    npm install

to install all dependencies

after that run the command

    npm run dev

to start the backend

The server will run on `http://localhost:3000`

## Starting the frontend

go into the folder

    Frontend/

and run the command

    npm install

to install all dependencies

after that run the command

    npm start

to start the frontend

the frontend will try to start on port 3000 which is alredy taken by the backend, and it will then ask to use another port, accept this, and the frontend will start on port 3001

## Registering an admin user

First we need an admin user. Use postman (https://www.getpostman.com/) or another tool to make a http request to the backend

 make a post http request to
 
    localhost:3000/api/v1/registerWithAdmin

 with headers

    Authorization: admin123
    Content-Type: application/json

and Body

``` json
{
	"username": "admin",
	"password": "admin",
	"appType" : "systemAdmin",
	"organisation": {
		"id": "-1",
		"name": "none"
	},
	"affiliation": {
		"id": "-1",
		"name": "none"
	}
}
```

## Using the frontend

open a browser and go to

    http://localhost:3001

and login with

    username: admin
    password: admin

go to the admin page using link in the menu
and start creating organisations and users

after creating a couple of organisations and users, you can start using the system by logging in with the created users, to create and manage cases.