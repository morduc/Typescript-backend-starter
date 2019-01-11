import "reflect-metadata";
import { Container } from 'inversify';
import { TYPES } from './types';

import { Config } from "../config/config";

// Services
import { IAuthenticationService } from "../services/interfaces/iAuthenticationService";
import { AuthenticationServiceImpl } from "../services/AuthenticationServiceImpl";

import { IOrganisationService } from "../services/interfaces/IOrganisationService";
import { OrganisationsServiceImpl } from "../services/OrganisationsServiceImpl";

import { ICaseService } from "../services/interfaces/ICaseService";
import { CaseServiceImpl } from "../services/CaseServiceImpl";

import { IFoodItemService } from '../services/interfaces/IFoodItemService';
import { FoodItemServiceImpl } from '../services/FoodItemServiceImpl';

// Controllers
import { ITestController } from "../controllers/interfaces/ITestController";
import { TestController } from '../controllers'

import { IAuthenticationController} from '../controllers/interfaces/IAuthenticationController';
import { AuthenticationControllerImpl } from "../controllers/AuthenticationControllerImpl";

import { IOrganisationController } from "../controllers/interfaces/IOrganisationsController";
import { OrganisationControllerImpl } from "../controllers/OrganisationControllerImpl";

import { ICaseController } from "../controllers/interfaces/ICaseController";
import { CaseControllerImpl } from "../controllers/CaseControllerImpl";

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
myContainer.bind<ICaseService>(TYPES.CaseService).to(CaseServiceImpl)
myContainer.bind<IFoodItemService>(TYPES.FoodItemService).to(FoodItemServiceImpl);
// Controllers
myContainer.bind<IAuthenticationController>(TYPES.AuthenticationController).to(AuthenticationControllerImpl)
myContainer.bind<ITestController>(TYPES.TestController).to(TestController);
myContainer.bind<IOrganisationController>(TYPES.OrganisationController).to(OrganisationControllerImpl)
myContainer.bind<ICaseController>(TYPES.CaseController).to(CaseControllerImpl);
// Stores
let couchDBStore = new CouchDBStore(Config.currentOrg.userStore);
myContainer.bind<ICouchDBStore>(TYPES.CouchDBStore).toConstantValue(couchDBStore);
myContainer.bind<IUserStore>(TYPES.UserStore).to(UserStore);

// Clients
let regClient = new RegistrationClient(Config.currentOrg);
myContainer.bind<IRegistrationClient>(TYPES.RegistrationClient).toConstantValue(regClient);

export { myContainer };