import { NextFunction, Request, Response, Application } from 'express';

import { IAuthenticationController } from "./interfaces/iAuthenticationController";
import { IAuthenticationService } from "../services/interfaces/IAuthenticationService"

import { UserToken } from "../models/auth/UserToken";
import { UserRegistrationRequest } from "../models/auth/userRegistrationRequest";

import { Config }  from "../config/config";

import { logger } from '../utils/logger';
import { injectable, inject } from 'inversify';
import { TYPES } from '../dependency-injection/types';

@injectable()
export class AuthenticationControllerImpl implements IAuthenticationController {


    private service: IAuthenticationService;
    private static adminSecret = (Config.conf.auth.adminSecret ? Config.conf.auth.adminSecret : "default" );

    constructor(@inject(TYPES.AuthenticationService)service: IAuthenticationService){
        this.service = service;
    }
    public async getUsers(req: Request, res: Response, next: NextFunction){
       try {
            let result = await this.service.getUsers([]);

            res.json({
                status: "ok",
                msg:"successfully retrieved users",
                users:result
            });
        }catch(e){
            res.sendStatus(500);
        }
    }
    public async registerWithAdmin(req: Request, res: Response, next: NextFunction){

        logger.info("AuthenticationController - Register With Admin");
        logger.info(JSON.stringify(req.body.username));

        let key;
        if(req.headers.authorization !== undefined){
            key = req.headers.authorization;
        }

        if (key !== AuthenticationControllerImpl.adminSecret){
            return res.sendStatus(401);
        }

        const newUserReq = new UserRegistrationRequest(
            req.body.username,
            req.body.password,
            req.body.organisation,
            req.body.affiliation,
            req.body.appType
        );

        try{
            const user = await this.service.registerUser(newUserReq);

            return res.send( {
                status: "ok",
                msg: `Successfully created user with id '${user.getName()}' and username '${req.body.username}'.`
            });
        }
        catch (e) {
            logger.error(e);
            res.send({ status: "error", msg: e.message });
        }
    }

    public async register(req: Request, res: Response, next: NextFunction){

        logger.info("AuthenticationController - Register");
        logger.info(JSON.stringify(req.body.username));

        const newUserReq = new UserRegistrationRequest(
            req.body.username,
            req.body.password,
            req.body.organisation,
            req.body.affiliation,
            "member"
        );

        try{
            const user = await this.service.registerUser(newUserReq);

            return res.send( {
                status: "ok",
                msg: `Successfully created user with id '${user.getName()}' and username '${req.body.username}'.`,
                user: {
                    id: user.getName(),
                    username: req.body.username,
                }
            });
        }
        catch (e) {
            logger.error(e);
            res.send({ status: "error", msg: e.message });
        }
    }

    public async login(req: Request, res: Response, next: NextFunction){

        logger.info("AuthenticationController - Login", req.body);
        logger.info("AuthenticationController - header", req.headers);

        try{
            const auth: any = await this.service.signIn(req.body.username, req.body.password);

            logger.debug("auth", auth);

            if(auth && auth.hasOwnProperty("token") && auth.token !== ""){
                return res.send(auth);
            }

        }
        catch (e) {
            logger.error(e);
        }

        res.sendStatus(401);
    }

    public authenticate(req: any, res: Response, next: NextFunction){

        logger.info("AuthenticationController - Authenticate", req.headers);

        let err;
        try {

            if(req.headers.authorization !== undefined){
                let bearer = req.headers.authorization.split(' ');
                let bearerToken = (bearer.length > 1 ? bearer[1] : "" );

                const result: any = this.service.verifyJwtToken(bearerToken);

                req.user = result.user as UserToken;

                return next();
            }

            err = "Missing authorization header";
        }
        catch (e) {
            err = e;
        }

        logger.warn(err);
        res.sendStatus(403);
    }

}