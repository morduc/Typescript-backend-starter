import "reflect-metadata";
import { Container } from 'inversify';
import { TYPES } from './types';

import { Config } from "../config/config";

// Services
import { IAuthenticationService } from "../services/interfaces/iAuthenticationService";
import { AuthenticationServiceImpl } from "../services/AuthenticationServiceImpl";

import { IOrganisationService } from "../services/interfaces/IOrganisationService";
import { OrganisationsServiceImpl } from "../services/OrganisationsServiceImpl";

// Controllers
import { ITestController } from "../controllers/interfaces/ITestController";
import { TestController } from '../controllers'

import { IAuthenticationController} from '../controllers/interfaces/IAuthenticationController';
import { AuthenticationControllerImpl } from "../controllers/AuthenticationControllerImpl";

import { IOrganisationController } from "../controllers/interfaces/IOrganisationsController";
import { OrganisationControllerImpl } from "../controllers/OrganisationControllerImpl";

// ---
import { IUserStore } from "../services/db/interfaces/IUserStore";
import { UserStore } from "../services/db/userStore";
import { ICouchDBStore } from "../services/db/interfaces/iCouchDBStore";
import CouchDBStore from "../services/db/couchDBStore";

// ---
import { IRegistrationClient } from "../services/blockchain/interfaces/iRegistrationClient";
import { RegistrationClient } from "../services/blockchain/registrationClient";




const myContainer = new Container();

// Services
myContainer.bind<IAuthenticationService>(TYPES.AuthenticationService).to(AuthenticationServiceImpl);
myContainer.bind<IOrganisationService>(TYPES.OrganisationService).to(OrganisationsServiceImpl)
// Controllers
myContainer.bind<IAuthenticationController>(TYPES.AuthenticationController).to(AuthenticationControllerImpl)
myContainer.bind<ITestController>(TYPES.TestController).to(TestController);
myContainer.bind<IOrganisationController>(TYPES.OrganisationController).to(OrganisationControllerImpl)
// Stores
let couchDBStore = new CouchDBStore(Config.currentOrg.userStore);
myContainer.bind<ICouchDBStore>(TYPES.CouchDBStore).toConstantValue(couchDBStore);
myContainer.bind<IUserStore>(TYPES.UserStore).to(UserStore);

// Clients
let regClient = new RegistrationClient(Config.currentOrg);
myContainer.bind<IRegistrationClient>(TYPES.RegistrationClient).toConstantValue(regClient);

export { myContainer };