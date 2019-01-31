import uuid = require("uuid"); 

import { UserToken } from "../models/auth/userToken";
import { SearchModel } from "../models/search/SearchModel";
import { IUpdateCase } from '../models/case/IUpdateCase';
import MemberClientFactory from "../models/factory/MemberClientFactory";

import { ICaseService } from "./interfaces/ICaseService";

import { InvokeRequest, QueryRequest } from "../models/blockchain/request/invokeRequest";

import { logger } from "../utils/logger";
import { injectable } from "inversify";
import { ICreateCase } from "../models/case/ICreateCase";
import { ICasePart } from "../models/case/ICasePart";
import { IUpdateCasePart } from "../models/Case/IUpdateCasePart";
import { ICase } from "../models/case/ICase";

@injectable()
export class CaseServiceImpl implements ICaseService {

    constructor(){}

    async createCase(user: UserToken, newCase: ICreateCase): Promise<ICreateCase> {

        if(!user || !newCase){
            throw new Error("Invalid args must provide valid UserToken and CreateCaseModel");
        }

        try {
            const client = MemberClientFactory.generateClient(user.id);
            // generating ids
            newCase.foodItem.id = uuid.v4();

            newCase.case.foodItem = newCase.foodItem.id;
            
            newCase.case.id = uuid.v4();
            
            newCase.casePart.id = uuid.v4();
            newCase.casePart.caseId = newCase.case.id;
            newCase.casePart.owner = user.affiliation.id
            newCase.casePart.nextParts = [];
            newCase.nextParts.forEach(part => {
                part.id = uuid.v4()
                part.caseId = newCase.case.id;
                part.nextParts = [];
                part.prevPart = newCase.casePart.id;
                newCase.casePart.nextParts.push(part.id);
            })
            
            

            const req: InvokeRequest = {
                chaincodeId: "c1",
                fcn: "create_case",
                args: [ JSON.stringify(newCase) ]
            };

            await client.invoke(req);

            logger.debug("case is: " + newCase);
           
            

            return newCase;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }
    }
    async updateCasePart(user: UserToken, updateCasePart: IUpdateCasePart){
        if(!user || !updateCasePart){
            throw new Error("Invalid args must provide valid UserToken and UpdateCasePartModel");
        }

        try {
            const client = MemberClientFactory.generateClient(user.id);
            
            for(let i = 0; i < updateCasePart.nextParts.length; i++){
                updateCasePart.nextParts[i].id = uuid.v4();
                updateCasePart.casePart.nextParts.push(updateCasePart.nextParts[i].id);
                updateCasePart.nextParts[i].caseId = updateCasePart.casePart.caseId;
                updateCasePart.nextParts[i].state = "new";
                updateCasePart.nextParts[i].prevPart = updateCasePart.casePart.id;

            }

            const req: InvokeRequest = {
                chaincodeId: "c1",
                fcn: "update_casepart",
                args: [ JSON.stringify(updateCasePart) ]
            };

            await client.invoke(req);

            logger.debug("case is: " + updateCasePart);
           
            

            return updateCasePart;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }
    }

       
    async updateCase(user: UserToken, caseUpdate: IUpdateCase) {
        if(!user || !caseUpdate){
            throw new Error("Invalid args must provide valid UserToken and UpdateCaseModel");
        }

        if(user.appType !== "systemAdmin"){
            throw new Error("user is not an system admin")
        }

        try {
                const client = MemberClientFactory.generateClient(user.id);
    
                const req: InvokeRequest = {
                    chaincodeId: "c1",
                    fcn: "update_case",
                    args: [ JSON.stringify(caseUpdate) ]
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

    async getCaseById(user: UserToken, id: string): Promise<any> {

        try {
            const client = MemberClientFactory.generateClient(user.id);

            const req: QueryRequest = {
                chaincodeId: "c1",
                fcn: "get_case",
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

    
    async getCaseHistory(user: UserToken, id: string): Promise<any> {
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

    async getAllCases(user: UserToken, search: SearchModel): Promise<ICase[]> {

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

            logger.debug(JSON.stringify(result));

            return result.result;
        }
        catch (e) {
            logger.error(e);
            throw e;
        }

    }
}


