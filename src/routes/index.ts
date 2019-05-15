import express from "express";

import { Router } from 'express';
import { testRouter } from  "./testRouter" 

const router: Router = express.Router();


router.use("/test", testRouter);
router.post('/', (_, res) => res.send("hej"))
// In case of authentication. Create an authenticationRouter with all the jazz, and router use.(someauth function)
// router.use("/", authenticationRouter); // Below is secure. Above routers are unsecure

export default router;
