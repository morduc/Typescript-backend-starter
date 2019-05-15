import "reflect-metadata";
import { Container } from "inversify";


// Services

// Controllers
import { ITestController } from "../controllers/interfaces/ITestController";
import { TestController } from "../controllers";
import {ITestRepository} from "../services/repositories/interfaces/ITestRepository";
import {TestRepositoryMock} from "../services/repositories/TestRepositoryMock";
import {TestRepositoryImpl} from "../services/repositories/TestRepositoryImpl";
import {INumberInteractor} from "../interactors";
import {NumberInteractorImpl} from "../interactors/NumberInteractorImpl";
import {TYPES} from "./TYPES";

const container = new Container();

// Services
container.bind<ITestRepository>(TYPES.TestRepository).to(TestRepositoryImpl);
// Interactors
container.bind<INumberInteractor>(TYPES.NumberInteractor).to(NumberInteractorImpl);

// Controllers
container.bind<ITestController>(TYPES.TestController).to(TestController);

export { container };
