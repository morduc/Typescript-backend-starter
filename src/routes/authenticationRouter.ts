import express from "express";
import { Router } from 'express';

import { myContainer } from '../dependency-injection/inversify.config';
import { IAuthenticationController } from "../controllers/interfaces/iAuthenticationController";
import { TYPES } from "../dependency-injection/types";

const router:Router = express.Router();
const controller: IAuthenticationController = myContainer.get<IAuthenticationController>(TYPES.AuthenticationController);

router.post('/registerwithadmin', async (req ,res, next) => controller.registerWithAdmin(req ,res, next) );

router.post('/login', async (req ,res, next) => controller.login(req ,res, next) );

router.all('*', (req ,res, next) => controller.authenticate(req ,res, next) );

router.post('/register', async (req ,res, next) => controller.register(req ,res, next) );

router.get('/user', async (req ,res, next) => controller.getUsers(req ,res, next) );

export const authenticationRouter: Router = router;