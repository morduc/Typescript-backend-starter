import { NextFunction, Request, Response } from 'express';

export interface IAuthenticationController {

    login(req: Request, res: Response, next: NextFunction): void;

    registerWithAdmin(req: Request, res: Response, next: NextFunction): void;
    
    register(req: Request, res: Response, next: NextFunction): void;

    authenticate(req: Request, res: Response, next: NextFunction): any;

    getUsers(req: Request, res: Response, next: NextFunction): any;

}