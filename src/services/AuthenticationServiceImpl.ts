import uuid = require("uuid");
import { sign, verify } from "jsonwebtoken";
import { inject, injectable} from 'inversify';
import crypto from "crypto";

import { UserDB } from "../models/db/UserDB";
import { UserRegistrationRequest } from "../models/auth/UserRegistrationRequest";

import { IRegisterRequest } from "fabric-ca-client";
import { IAuthenticationService } from "./interfaces/iAuthenticationService";
import { IRegistrationClient } from "./blockchain/interfaces/IRegistrationClient";
import { IUserStore } from "./db/interfaces/IUserStore";

import { Config } from "../config/config";

import { logger } from "../utils/logger";
import { TYPES } from "../dependency-injection/types";
import { stringify } from "querystring";
import { UserStore } from "./db/userStore";

@injectable()
export class AuthenticationServiceImpl implements IAuthenticationService {

    private secret: string = (Config.conf.auth.jwtSecret ? Config.conf.auth.jwtSecret : "default");
    private registrationClient: IRegistrationClient;

    private userStore: IUserStore;

    constructor(@inject(TYPES.RegistrationClient)registrationClient: IRegistrationClient, @inject(TYPES.UserStore)userStore: IUserStore) {
        logger.info("JWT Secret:", this.secret);
        
        this.registrationClient = registrationClient;
        this.userStore = userStore;

        this.registrationClient.prepare();
    }
    public async getUsers(orgs: string[]) {
        let result = await this.userStore.getUsers(orgs);

        return result.map((res:any) =>  {return {username: res.data.username, affiliation: res.data.affiliation}})
    }

    public async signIn(username: string, password: string) {

        let res: any = {};

        // Find user in db
        let user = await this.userStore.getUser(username);

        if(!user){
            return res;
        }

        let hash = this.sha512Hash(password, user.salt);
        if(hash === user.password){
            const embeddedProfile = {
                id: user.id,
                username: user.username,
                organisation: user.organisation,
                affiliation: user.affiliation,
                appType: user.appType
            };

            res.token = this.issueJwtToken({ user: embeddedProfile });
            res.username = user.username;
            res.affiliation = user.affiliation.name
            res.appType = user.appType;
            this.verifyJwtToken(res.token);
        }

        return res;
    }

    public async registerUser(req: UserRegistrationRequest) {

        if(!req.isUserRegistrationReqValid()){
            throw new Error("User Registration Request is invalid!");
        }

        try {
            let salt = this.generateSalt(40);
            let hash = this.sha512Hash(req.password as string, salt);
            const newUserCAReq: IRegisterRequest = {
                enrollmentID: uuid.v4(),
                enrollmentSecret: req.password,
                maxEnrollments: -1,
                role: "client",
                attrs: [
                    { name: "username", value: req.username, ecert: true },
                    { name: "organisationId", value: req.organisation.id, ecert: true },
                    { name: "organisationName", value: req.organisation.name, ecert: true },
                    { name: "affiliationId", value: req.affiliation.id, ecert: true },
                    { name: "affiliationName", value: req.affiliation.name, ecert: true },
                    { name: "app.type", value: req.appType, ecert: true }
                ],
                affiliation: "org.bachelor_dtu"
            };

            let user = await this.registrationClient.registerUser(newUserCAReq);

            const profile: UserDB = {
                id: newUserCAReq.enrollmentID,
                username: req.username,
                password: hash,
                affiliation: req.affiliation,
                organisation: req.organisation,
                appType: req.appType,
                salt: salt
            };

            await this.userStore.createUser(profile);

            return user;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }
    }

    public verifyJwtToken(token: string) {

        logger.debug("Verify token:", token);
        try {
            const decoded = verify(token, this.secret);

            logger.debug(stringify(decoded));
            
            return decoded;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    private issueJwtToken(payload: any) {
        return sign(payload, this.secret, { expiresIn: '70d' }); // 2h
    }

    private generateSalt(length: number): string {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, length);   // return required number of characters
    };

    private sha512Hash(password: string, salt: string): string {
        let hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512
        hash.update(password);
        return hash.digest('hex');
    }

}