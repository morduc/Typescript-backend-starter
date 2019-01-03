import express from "express";

import { Router } from 'express';
import { authenticationRouter } from "./authenticationRouter";
import { organisationRouter } from './organisationRouter';
import { testRouter } from  "./testRouter" 


const router: Router = express.Router();

/* BIND EACH ROUTER TO A BASE */

router.use("/test", testRouter);
router.use("", authenticationRouter); // Below is secure. Above routers are unsecure ~ consumers here^
router.use("/organisation", organisationRouter);
//router.use("/lot", lotRouter);



export const apiRouter: Router = router;