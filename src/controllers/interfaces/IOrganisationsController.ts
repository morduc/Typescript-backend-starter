import { NextFunction, Request, Response } from 'express';

export interface IOrganisationController {

    postCreateOrganisation(req: any, res: Response, next: NextFunction): void;

    getOrganisation(req: any, res: Response, next: NextFunction): void;
    
    getOrganisations(req: any,res: Response, next: NextFunction):void;
}