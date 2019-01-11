import express from "express";
import { Router } from 'express';

import { myContainer } from '../dependency-injection/inversify.config';
import { ICaseController } from "../controllers/interfaces/ICaseController";
import { TYPES } from "../dependency-injection/types";

const router:Router = express.Router();
const controller: ICaseController = myContainer.get<ICaseController>(TYPES.CaseController);

// Update CasePart
router.put('/', async (req, res, next) => controller.putUpdateCasePart(req, res, next))

// Get CasePart History
router.get('/:id/history', async (req, res, next) => controller.getHistoryForCasePart(req, res, next))
export const casePartRouter: Router = router;