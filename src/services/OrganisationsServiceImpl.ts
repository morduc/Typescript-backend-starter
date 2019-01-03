import uuid = require("uuid");

import { UserToken } from "../models/auth/userToken";
import { SearchModel } from "../models/search/SearchModel";
import { OrganisationModel } from "../models/organisation/OrganisationModel";

import MemberClientFactory from "../models/factory/MemberClientFactory";

import { IOrganisationService } from "./interfaces/IOrganisationService";

import { InvokeRequest, QueryRequest } from "../models/blockchain/request/invokeRequest";

import { logger } from "../utils/logger";
import { injectable } from "inversify";

@injectable()
export class OrganisationsServiceImpl implements IOrganisationService {

    constructor(){}

    async createOrganisation(user: UserToken, organisation: OrganisationModel): Promise<OrganisationModel> {

        if(!user || !organisation){
            throw new Error("Invalid args must provide valid UserToken and organisationModel");
        }

        try {
            const client = MemberClientFactory.generateClient(user.id);

            organisation.id = uuid.v4();

            const req: InvokeRequest = {
                chaincodeId: "c1",
                fcn: "create_organisation",
                args: [ JSON.stringify(organisation) ]
            };

            await client.invoke(req);

            logger.debug("organisation id is:", organisation.id);

            return organisation;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }
    }

    // async updateBatch(user: UserTokenModel, batch: BatchModel): Promise<any> {

    //     if(!user || !batch){
    //         throw new Error("Invalid args must provide valid BatchModel & UserTokenModel");
    //     }

    //     try {
    //         const client = MemberClientFactory.generateClient(user.id);

    //         const req: InvokeRequest = {
    //             chaincodeId: "c1",
    //             fcn: "update_batch",
    //             args: [ JSON.stringify(batch) ]
    //         };

    //         let result = await client.invoke(req);

    //         logger.debug(result);
    //     }
    //     catch (e) {
    //         logger.error(e);
    //         throw e;
    //     }
    // }

    // async deleteBatch(user: UserTokenModel, id: string): Promise<any> {

    //     try {
    //         const client = MemberClientFactory.generateClient(user.id);

    //         const req: InvokeRequest = {
    //             chaincodeId: "c1",
    //             fcn: "delete_batch",
    //             args: [ id ]
    //         };

    //         let result = await client.invoke(req);

    //         logger.debug(result);
    //     }
    //     catch (e) {
    //         logger.error(e);
    //         throw e;
    //     }

    // }

    async getAllOrganisations(user: UserToken, search: SearchModel): Promise<any> {

        try {
            const client = MemberClientFactory.generateClient(user.id);
            logger.debug(JSON.stringify(search.query))
            const req: QueryRequest = {
                chaincodeId: "c1",
                fcn: "perform_search",
                args: [ JSON.stringify(search.query) ]
            };

            let result = await client.query(req);

            logger.debug(result);

            return result;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }

    }

    // async getAllBatchesPagination(user: UserTokenModel, search: SearchModel): Promise<any> {

    //     try {
    //         const client = MemberClientFactory.generateClient(user.id);

    //         let bookmark = "";
    //         if(search.pageBookmark && search.pageBookmark !== "")
    //             bookmark = search.pageBookmark;

    //         let size = "1";
    //         if(search.pageSize && search.pageSize !== "")
    //             size = search.pageSize;

    //         const req: QueryRequest = {
    //             chaincodeId: "c1",
    //             fcn: "perform_search_page",
    //             args: [ JSON.stringify(search.query), size, bookmark ]
    //         };

    //         let result = await client.query(req);

    //         logger.debug(result);

    //         return result;
    //     }
    //     catch (e) {
    //         logger.error(e);
    //         throw e;
    //     }

    // }

    async getOrganisationById(user: UserToken, id: string): Promise<any> {

        try {
            const client = MemberClientFactory.generateClient(user.id);

            const req: QueryRequest = {
                chaincodeId: "c1",
                fcn: "get_organisation",
                args: [ id ]
            };

            let result = await client.query(req);

            logger.debug(result);

            return result;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }

    }

    // async getBatchHistory(user: UserTokenModel, id: string): Promise<any> {
    //     try {
    //         const client = MemberClientFactory.generateClient(user.id);

    //         const req: QueryRequest = {
    //             chaincodeId: "c1",
    //             fcn: "get_history_for_key",
    //             args: [ id ]
    //         };

    //         let result = await client.query(req);

    //         logger.debug(result);

    //         return result;
    //     }
    //     catch (e) {
    //         logger.error(e);
    //         throw e;
    //     }
    // }

}


