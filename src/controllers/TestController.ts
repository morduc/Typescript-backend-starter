import { Application, Request, Response, NextFunction} from 'express';

import { IRegistrableController } from '.';
import { injectable, inject } from 'inversify';
import { TYPES } from '../dependency-injection/types';
import { API_ROUTE, TEST_ROUTE } from '../routes';
@injectable()
export class TestController implements IRegistrableController {

  route: string;
  constructor(){ 
    this.route = API_ROUTE + TEST_ROUTE;
  }


  public register(app: Application):void {
    app.route(this.route)
      .get((req: Request, res: Response, next: NextFunction) => {
        res.send("get: test route ");
      })
      
    app.route(this.route + "/ping")
      .get( (req: Request, res: Response, next: NextFunction) => {
        res.send('ping');
      })
  }
}