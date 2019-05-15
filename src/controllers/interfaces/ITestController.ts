import {NextFunction, Request, Response} from 'express';

export interface ITestController {

    ping(req: Request, res: Response, next: NextFunction): void;

    test(req: Request, res: Response, next: NextFunction): void;

}
