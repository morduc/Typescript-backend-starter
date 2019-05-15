# Typescript Clean Architecture - backend starter

### scripts
`npm run dev` running the project in development mode using typescript live compiling

`npm test` runs all test 

`npm run test` runs all test with coverage report (WORK IN PROGESS)

`npm build` transpiles the typescript to javascript and copying it to `./build`folder

`npm run build-start` same as builds, but runs the transpiled javascript code


## Intro 
This project uses typescript clean architecture

The application is therefore split up in following layers
* Controllers
* Interactors
* Services

Controllers are only calling interactors

Interactors can call services and other interactors.

Services can only be called.
### Logging and debugging
All log output should be donee using log4js this will filter outputted logs depending on environment
use
``` javascript
import { Logger } from "./src/utils/logger";
const logger = getLogger();
```
then use one of the following which is most fitting
``` javascript
// Production and and test Dev env
logger.info();
logger.error();
logger.trace();
logger.warn();
logger.fatal();

// Dev environment
logger.debug();
```
### Dependency Injection
Everything is connect using dependency injection, and the dependencies is defined in `./src/dependency-injection/inversify.config.ts`

To use this, every controller, interactor and service needs to be described using interfaces.
and all interactors, controllers and service classes need to have the injectable decorator.

For example of how to inject classes. See the TestController, TestInteractor and TestRepo

## Controllers

With exceptions, controllers should mostly do the following
* Sanitize input from request
* Call interactors to store/get dataø
* Format data for response

## Interactors
With exceptions, interactors should contain public and private functions which should be as small as possible to be able to test easily
List of typical application

* Contain logic for retrieving data using services
* Process data

## Services
Wiht exceptions services encompasses the following
* API calls
* Database calls
* Other services in this area

## Tests

The project uses jest framework for testing. check the test of controller, and interactor to see examples of mocking both services, interactors, and express request and responses

