import uuid = require("uuid"); 

import { UserToken } from "../models/auth/userToken";
import { SearchModel } from "../models/search/SearchModel";
import { IUpdateCase } from '../models/case/IUpdateCase';
import MemberClientFactory from "../models/factory/MemberClientFactory";

import { IFoodItemService } from "./interfaces/IFoodItemService";

import { InvokeRequest, QueryRequest } from "../models/blockchain/request/invokeRequest";

import { logger } from "../utils/logger";
import { injectable } from "inversify";
import { ICasePart } from "../models/case/ICasePart";
import { IFoodItem } from "../models/case/IFoodItem";

@injectable()
export class FoodItemServiceImpl implements IFoodItemService {

    constructor(){}


    async updateFoodItem(user: UserToken, foodItem: IFoodItem) {
        if(!user || !foodItem){
            throw new Error("Invalid args must provide valid UserToken and UpdateCaseModel");
        }

        try {
                const client = MemberClientFactory.generateClient(user.id);
    
                const req: InvokeRequest = {
                    chaincodeId: "c1",
                    fcn: "update_fooditem",
                    args: [ JSON.stringify(foodItem) ]
                };
    
                let result = await client.invoke(req);
    
                logger.debug(result);
                return result
            }
            catch (e) {
                logger.error(e);
                throw e;
            }

    }

    async getAllFoodItems(user: UserToken, search: SearchModel): Promise<IFoodItem[]> {

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

            return result.result;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }

}
    async getFoodItemById(user: UserToken, id: string): Promise<any> {

        try {
            const client = MemberClientFactory.generateClient(user.id);

            const req: QueryRequest = {
                chaincodeId: "c1",
                fcn: "get_fooditem",
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

    
    async getFoodItemHistory(user: UserToken, id: string): Promise<any> {
        try {
            const client = MemberClientFactory.generateClient(user.id);

            const req: QueryRequest = {
                chaincodeId: "c1",
                fcn: "get_history_for_key",
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

    async getAllCases(user: UserToken, search: SearchModel): Promise<any> {

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

    async getAllCaseParts(user: UserToken, search: SearchModel): Promise<ICasePart[]> {

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

            return result.result;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }
    }
}


