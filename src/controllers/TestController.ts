import { Request, Response, NextFunction} from "express";

import {inject, injectable} from "inversify";

import { ITestController } from "./interfaces/ITestController";
import {INumberInteractor} from "../interactors";

import * as Logger from "log4js";
import {TYPES} from "../dependency-injection/TYPES";
const logger  = Logger.getLogger();

@injectable()
export class TestController implements ITestController {

    // this returns our bound testStore.
    private _numberInteractor: INumberInteractor;

    constructor(
        @inject(TYPES.NumberInteractor) numInteractor: INumberInteractor,
    ) {
        this._numberInteractor = numInteractor;
    }

    public async ping(req: Request, res: Response, next: NextFunction) {
        res.send("ping");
    }

    public async test(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._numberInteractor.getAccumulatedNumbers(req.body.id);
            res.send(result);
        } catch (e) {
            logger.error(e);
            res.status(500).json(e);
        }
    }
}

