import { NextFunction, Request, Response } from 'express';

export interface ICaseController {

    postCreateCase(req: any, res: Response, next: NextFunction): void;

    getCase(req: any, res: Response, next: NextFunction): void;
    getCases(req: any,res: Response, next: NextFunction):void;
    //getFoodItems(req: any, res: Response, next: NextFunction): void;
    putUpdateCase(req: any,res: Response, next: NextFunction):void;

    getHistoryForCase(req:any, res:Response, next: NextFunction):void;
    getHistoryForCasePart(req: any, res: Response, next: NextFunction):void

    putUpdateCasePart(req: any, res: Response, next: NextFunction): void;
}