import express from "express";
import { Router } from 'express';

import { myContainer } from '../dependency-injection/inversify.config';
import { ICaseController } from "../controllers/interfaces/ICaseController";
import { TYPES } from "../dependency-injection/types";

const router:Router = express.Router();
const controller: ICaseController = myContainer.get<ICaseController>(TYPES.CaseController);


// Create Case
router.post('/', async (req ,res, next) => controller.postCreateCase(req ,res, next) );

// Get a Single Case
router.get('/:id', async (req,res,next) => controller.getCase(req,res,next))

// Update a Case
router.put('/', async (req, res, next) => controller.putUpdateCase(req, res, next))

// Get case history
router.get('/:id/history', async (req, res, next) => controller.getHistoryForCase(req, res, next))

router.get('/', async (req, res, next) => controller.getCases(req, res, next));

export const caseRouter: Router = router;