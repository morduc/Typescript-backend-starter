import Hfc, { User } from "fabric-client";
import {inject, injectable} from 'inversify';
import { CAHelper } from "./caHelper";

import { OrganisationConf } from "../../models/blockchain/conf/OrganisationConf";

import { ICAHelper } from "./interfaces/iCAHelper";
import { IEnrollmentRequest, IRegisterRequest, IRevokeRequest } from "fabric-ca-client";
import { IRegistrationClient } from "./interfaces/iRegistrationClient";

import { logger } from '../../utils/logger'
@injectable()
export class RegistrationClient implements IRegistrationClient {

    private _client: Hfc;
    private _ca?: ICAHelper;

    private _admin?: User;
    private _org: OrganisationConf;


    constructor(conf: OrganisationConf) {

        this._org = conf
        this._client = new Hfc();


    }

    async registerUser(req: IRegisterRequest | undefined) {

        if (!req) {
            throw new Error("Must provide a valid RegisterRequest")
        }

        if (!this._admin) {
            logger.error(`Admin usercontext not set. Cannot perform any operations without it!`);
            throw new Error("Admin usercontext not set. Cannot perform any operations without it!");
        }

        try {
            // Make sure this user doesn't exist
            logger.info(`Checking if user with id ${req.enrollmentID} exists in state store...`);
            let user = await this._client.loadUserFromStateStore(req.enrollmentID);

            if (user) {
                logger.warn(`User with id ${req.enrollmentID} is already existing!`);
                throw new Error(`User with id ${req.enrollmentID} is already existing!`);
            }

            // Register and enroll user
            logger.info(`Registering user called ${req.enrollmentID} through admin....`);
            req.enrollmentSecret = await this._ca!.registerUser(this._admin, req);
            logger.info(`Registering ${req.enrollmentID} is done`);


            const enrollReq: IEnrollmentRequest = {
                enrollmentID: req.enrollmentID,
                enrollmentSecret: req.enrollmentSecret
            };


            logger.info(`Enrolling user with id: ${enrollReq.enrollmentID}`);
            user = await this._ca!.enrollUser(this._client, enrollReq);
            logger.info(`Enrolling user with id ${enrollReq.enrollmentID}: done`);

            logger.debug(`user: ${user}`);

            return user;
        }
        catch (e) {
            throw e;
        }

    }

    async reenroll(enrollmentId: string) {

        if (!this._admin) {
            throw new Error("Admin usercontext not set. Cannot perform any operations without it!");
        }

        try {
            logger.info(`Reenrolling user with id ${enrollmentId}...`);
            await this._ca!.reenroll(this._client, enrollmentId);
            logger.info(`Reenrollment for user with id ${enrollmentId} done`);
        }
        catch (e) {
            throw e;
        }

    }

    async revokeUser(enrollmentId: string) {

        if (!this._admin) {
            throw new Error("Admin usercontext not set. Cannot perform any operations without it!");
        }

        const req: IRevokeRequest = {
            enrollmentID: enrollmentId
        };

        try {
            logger.info(`Revoking user with id ${enrollmentId}...`);
            await this._ca!.revoke(this._client, this._admin, req);
            logger.info(`Revokment of user with id ${enrollmentId} done`);
        }
        catch (e) {
            throw e;
        }


    }

    async loadAdmin() {

        try {
            logger.info("Loading admin from state store...");
            this._admin = await this._client.loadUserFromStateStore("admin");
            logger.info(`Completed loading admin from state store: ${(this._admin !== null ? "exists" : "does not exist!")}`);

            if (!this._admin) {
                logger.info("Enrolling admin...");

                const req: IEnrollmentRequest = {
                    enrollmentID: "admin",  // development only
                    enrollmentSecret: "adminpw" // development only
                };

                this._admin = await this._ca!.enrollUser(this._client, req);
                logger.info("Enrolling admin done");
            }
        }
        catch (e) {
            logger.error(`Failed loading admin user. Error: ${e.message}`);
            throw e;
        }
    }

    async initStoresAndCA(ca?: ICAHelper) {

        try {
            Hfc.setConfigSetting("key-value-store", "fabric-client/lib/impl/CouchDBKeyValueStore.js");

            const stateOptions = {
                path: "../../../resources",
                name: this._org.stateStore.name,
                url: this._org.stateStore.url
            };

            const stateKeyStore = await Hfc.newDefaultKeyValueStore(stateOptions);
            await this._client.setStateStore(stateKeyStore);


            const clientCryptoOptions = {
                path: "../../../resources",
                name: this._org.clientCryptoStore.name,
                url: this._org.clientCryptoStore.url
            };

            const clientCryptoSuite = Hfc.newCryptoSuite();
            const clientCryptoStore = Hfc.newCryptoKeyStore(clientCryptoOptions);

            clientCryptoSuite.setCryptoKeyStore(clientCryptoStore);
            this._client.setCryptoSuite(clientCryptoSuite);

            const caCryptoOptions = {
                path: "../../../resources",
                name: this._org.caCryptoStore.name,
                url: this._org.caCryptoStore.url
            };
            const caCryptoSuite = Hfc.newCryptoSuite();
            const caCryptoStore = Hfc.newCryptoKeyStore(caCryptoOptions);

            caCryptoSuite.setCryptoKeyStore(caCryptoStore);

            if (!ca)
                this._ca = new CAHelper(this._org.ca, caCryptoSuite);
            else
                this._ca = ca;

        } catch (e) {
            logger.error(`Failed to prepare CA. Error: ${e.message}`);
            throw e;
        }

    }

    async prepare(ca?: ICAHelper) {

        await this.initStoresAndCA(ca);
        await this.loadAdmin();
    }

}