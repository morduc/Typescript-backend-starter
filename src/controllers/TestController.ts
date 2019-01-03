import { injectable } from 'inversify';
import { Request, Response, NextFunction} from 'express';

import { ITestController } from './interfaces/ITestController';

@injectable()
export class TestController implements ITestController {

  public async ping (req: Request, res: Response, next: NextFunction) 
  {
    res.send('ping');
  }
  public async test (req: Request, res: Response, next: NextFunction) 
  {
    res.send("get: test route ");
  }
}