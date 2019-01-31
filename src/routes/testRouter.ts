import express from "express";
import { Router } from 'express';

import { myContainer } from '../dependency-injection/inversify.config';
import { TYPES } from "../dependency-injection/types";
import { ITestController } from "../controllers/interfaces/ITestController";

const router:Router = express.Router();
const controller: ITestController = myContainer.get<ITestController>(TYPES.TestController);

router.post('/test', async (req ,res, next) => controller.test(req ,res, next) );

router.post('/register/ping', async (req ,res, next) => controller.ping(req ,res, next) );

export const testRouter: Router = router;