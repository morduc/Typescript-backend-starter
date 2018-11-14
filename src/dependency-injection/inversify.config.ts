import "reflect-metadata";
import { Container } from 'inversify';
import { TYPES } from './types';
import { TestController, IRegistrableController } from '../controllers'

const myContainer = new Container();

myContainer.bind<IRegistrableController>(TYPES.Controller).to(TestController);

export { myContainer };