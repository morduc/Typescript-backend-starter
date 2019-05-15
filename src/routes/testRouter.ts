import express, { Router } from "express";

import { container} from "../dependency-injection/inversify.config";
import { ITestController } from "../controllers/interfaces/ITestController";
import {TYPES} from "../dependency-injection/TYPES";

const router: Router = express.Router();
const controller: ITestController = container.get<ITestController>(TYPES.TestController);

router.post("/test", async (req, res, next) => controller.test(req, res, next) );

router.post("/ping", async (req, res, next) => controller.ping(req, res, next) );

export const testRouter: Router = router;
