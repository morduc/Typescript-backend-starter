import { IMemberClient } from "./interfaces/iMemberClient";
import { BaseBCClient } from "./baseBCClient";
import { BlockchainBaseConf } from "../../models/blockchain/conf/BlockchainBaseConf";
import {InvokeRequest, QueryRequest} from "../../models/blockchain/request/invokeRequest";
import Hfc, {Channel} from "fabric-client";

import { logger } from "../../utils/logger";

export class MemberClient extends BaseBCClient implements IMemberClient {


    private contextReady: Promise<any>;

    constructor(conf: BlockchainBaseConf, enrollmentId: string, client?: Hfc, channel?: Channel) {
        super(conf,client,channel);

        this.contextReady = this.prepareUserContext(enrollmentId);
    }


    public async prepareUserContext(enrollmentId: string): Promise<any> {

        try {
            await this.initializeStoresAndCA();

            let user = await this._client.loadUserFromStateStore(enrollmentId);

            if (user) {
                logger.debug(`User with id ${enrollmentId} found in state store`);
                this._client.setUserContext(user, true);
                return Promise.resolve(user);
            }
            else {
                logger.error(`User with id ${enrollmentId} NOT found in state store..`);
                throw new Error(`User with id ${enrollmentId} NOT found in state store..`);
            }

        }
        catch (e) {
            logger.error(e);
            return Promise.reject(e);
        }
    }

    async invoke(req: InvokeRequest): Promise<any> {
        await this.contextReady;
        if (this.contextReady) {
            logger.debug("==> Running " + req.fcn);
            return this._invoke(req);
        }
    }

    async query(req: QueryRequest): Promise<any> {
        await this.contextReady;
        if (this.contextReady) {
            logger.debug("==> Running " + req.fcn);
            return this._query(req);
        }
    }
}