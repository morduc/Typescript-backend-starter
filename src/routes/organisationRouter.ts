import express from "express";
import { Router } from 'express';

import { myContainer } from '../dependency-injection/inversify.config';
import { IOrganisationController } from "../controllers/interfaces/IOrganisationsController";
import { TYPES } from "../dependency-injection/types";
import { OrganisationControllerImpl } from "../controllers/OrganisationControllerImpl";

const router:Router = express.Router();
const controller: IOrganisationController = myContainer.get<IOrganisationController>(TYPES.OrganisationController);

router.get('/:id', async (req ,res, next) => controller.getOrganisation(req ,res, next) );

router.get('/', async (req, res, next) => controller.getOrganisations(req,res,next))
router.post('/', async (req ,res, next) => controller.postCreateOrganisation(req ,res, next) );



export const organisationRouter: Router = router;