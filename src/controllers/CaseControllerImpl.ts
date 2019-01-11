import { NextFunction, Response } from 'express';

import { ICaseController } from './interfaces/ICaseController';
import { injectable, inject } from 'inversify';
import { TYPES } from '../dependency-injection/types';
import { logger } from '../utils/logger';
import { ICaseService } from '../services/interfaces/ICaseService';
import { ICasePart } from '../models/case/ICasePart';
import { IFoodItemService } from '../services/interfaces/IFoodItemService';
import { MemberClient } from '../services/blockchain/memberClient';

@injectable()
export class CaseControllerImpl implements ICaseController {
    private caseService: ICaseService;
    private foodItemService: IFoodItemService;

    constructor(
        @inject(TYPES.CaseService) caseService: ICaseService,
        @inject(TYPES.FoodItemService) foodItemService: IFoodItemService
    ){
        this.caseService = caseService;
        this.foodItemService = foodItemService;
    }


    public async postCreateCase(req: any, res: Response, next: NextFunction){
        logger.debug("postCreateCreateCase" + req.body)

        try {
            let newCase = req.body;
            newCase = await this.caseService.createCase(req.user, newCase);

            res.json({status: "ok", msg: `case with id '${newCase.case.id}' has been created`, case: newCase})
        } catch(e) {
            logger.error(e);
            res.status(500);
            res.json({status: "error", msg: e.message});
        }
    }

    public async putUpdateCasePart(req: any, res: Response, next: NextFunction){
        logger.debug("putUpdateCasePart" + req.body);

        try {
            let updateCasePart = req.body;
            logger.debug("calling updatecase service")
            await this.caseService.updateCasePart(req.user, updateCasePart);
            
            res.json({status: "ok", msg: `casepart with id '${updateCasePart.id}' has been updated`, case: updateCasePart})
        } catch(e) {
            logger.error(e);
            res.status(500);
            res.json({status: "error", msg: e.message});
        }
        
    }



    public async getCase(req: any, res: Response, next: NextFunction) {
        logger.debug("getCase" + req.params.id)
        
        try {
            let caseId = req.params.id;
            let calls = [];
            calls.push(await this.caseService.getCaseById(req.user, caseId));
        
            let partSearchModel:any= {
                query: {
                    selector:{
                        docType: "casePart" ,
                        caseId: caseId
                    }                    
                }
            }

            if(req.user.appType !== "systemAdmin"){
                partSearchModel.query.selector.owner = req.user.affiliation.id
            }
            
            calls.push(await this.caseService.getAllCaseParts(req.user, partSearchModel));

            let [{Case}, result]  = await Promise.all(calls);
            console.log(Case);
            console.log(result);
            
            let {FoodItem} = await this.foodItemService.getFoodItemById(req.user, Case.foodItem);

            //build query to get caseParts
            let parts: ICasePart[] = [];
            if(result.length > 0){
                parts.push(...result);
                if(req.user.appType !== "systemAdmin"){
                    let ids: string[] = [];
                    for(let i = 0; i < parts[0].nextParts.length; i++)
                    {
                        ids.push(parts[0].nextParts[i]);
                    }                
                    if(result[0].prevPart !== ""){
                        ids.push(result[0].prevPart);
                    }

                    let searchModel:any= {
                                        query: {
                                            selector:{
                                                docType: "casePart",
                                                id: {
                                                    $in: ids
                                                }
                                        }
                                    }
                                }
                    console.log(JSON.stringify(searchModel));
                    parts.push(...await this.caseService.getAllCaseParts(req.user, searchModel));
                    console.log(JSON.stringify(parts));
                }
            }
            
            let response = {
                case: Case,
                foodItem: FoodItem,
                parts: parts
            }

            res.json(response);
            // if(result && result.organisation) {
            //     res.json({status: "ok", organisation: result.organisation})
            // } else {
            //     res.status(404);
            //     // res.json({status: "error", msg: `Did not find organisation with id '${orgId}'`});
            // }
        } catch(e){
            logger.error(e);
            res.status(500);
            res.json({ status: "error", msg: e.message})
        }
    }
    
    public async putUpdateCase(req: any, res: Response, next: NextFunction) {
        logger.debug("putUpdateCase" + JSON.stringify(req.body));

        try {
            let updateCase = req.body;
            await this.caseService.updateCase(req.user, updateCase);
            
            res.json({status: "ok", msg: `case with id '${updateCase.id}' has been update`, case: updateCase})
        } catch(e) {
            logger.error(e);
            res.status(500);
            res.json({status: "error", msg: e.message});
        }
    }
    
    public async getHistoryForCase(req: any, res: Response, next: NextFunction) {
        logger.debug("getHistoryForCase" + req.params.id)
        
        try {
            let caseId = req.params.id;
            let {result} = await this.caseService.getCaseHistory(req.user, caseId);
            if(result.length <= 0){
                throw new Error("does not exist");
            }
            console.log(JSON.stringify(result));
         let response = result.map((caseHistory:any) => {
            return {
                case: caseHistory.value,
                timestamp: caseHistory.timestamp,
            }
        })
         res.json({
             caseHistory: response
         });
        } catch(e){
            logger.error(e);
            res.status(500);
            res.json({ status: "error", msg: e.message})
        }
    }
   

    // public async getCases(req: any,res: Response, next: NextFunction){
    //     console.log("getCases" + req.body)
            
    //     try{
    //         console.log(req.user);
    //             // Basic searchmodel
    //             let searchModel:any= {
    //                 query: {
    //                     selector:{
    //                         docType: "casePart"               
    //                     }
    //                 }
    //             }
    //             console.log(req.user);
    //             if(req.user.appType === "member"){
    //                 console.log("member");
    //                 searchModel.query.selector.owner = req.user.affiliation.id
    //             }

    //             let caseParts = await this.caseService.getAllCaseParts(req.user, searchModel);
    //             let caseIds:string[] = [];
    //             caseParts.forEach(part => {
    //                 if(caseIds.indexOf(part.caseId) < 0) caseIds.push(part.caseId);
    //             })

    //             let caseSM:any= {
    //                 query: {
    //                     selector:{
    //                         docType: "case",
    //                         id: {
    //                             $in: caseIds
    //                         }               
    //                     }
    //                 }
    //             }
    //             let cases = await this.caseService.getAllCases(req.user, caseSM)
    //             let caseList = cases.map(aCase => {
    //                 return {
    //                     case: aCase,
    //                     caseParts: caseParts.filter(part => part.caseId === aCase.id)
    //                 }
    //             })
    //             //logger.debug(JSON.stringify(caseParts,null, 2));
    //             return res.json({
                    
    //                 cases: caseList
    //             });

    //     }
    //     catch (e) {
    //         logger.error("getCases")
    //         logger.error(e);
    //         res.status(500);
    //         res.send({ status: "error", msg: e.message });
    //     }
    // }

     public async getCases(req: any,res: Response, next: NextFunction){
        console.log("getCases" + req.body)
            
        try{
            console.log(req.user);
                // Basic searchmodel
                let searchModel:any= {
                    query: {
                        selector:{
                            docType: "casePart"               
                        }
                    }
                }
                console.log(req.user);
                if(req.user.appType === "member"){
                    console.log("member");
                    searchModel.query.selector.owner = req.user.affiliation.id
                }

                let caseParts = await this.caseService.getAllCaseParts(req.user, searchModel);
                let caseIds:string[] = [];
                caseParts.forEach(part => {
                    if(caseIds.indexOf(part.caseId) < 0) caseIds.push(part.caseId);
                })

                let caseSM:any= {
                    query: {
                        selector:{
                            docType: "case",
                            id: {
                                $in: caseIds
                            }               
                        }
                    }
                }
                let cases = await this.caseService.getAllCases(req.user, caseSM)
                let foodItemIds:string[] = [];
                cases.forEach(aCase => {
                    if(foodItemIds.indexOf(aCase.foodItem) < 0 && aCase.foodItem) foodItemIds.push(aCase.foodItem);
                })
               
                let foodItemSM:any= {
                    query: {
                        selector:{
                            docType: "foodItem",
                            id: {
                                $in: foodItemIds
                            }              
                        }
                    }
                }

                console.log(JSON.stringify(foodItemSM, null, 2));
                
                let foodItems = await this.foodItemService.getAllFoodItems(req.user, foodItemSM)
                
                let caseList = cases.map(aCase => {
                    return {
                        case: aCase,
                        foodItem: foodItems.find(item => item.id == aCase.foodItem),
                        caseParts: caseParts.filter(part => part.caseId === aCase.id)
                    }
                })
                //logger.debug(JSON.stringify(caseParts,null, 2));
                return res.json({
                    
                    cases: caseList
                });

        }
        catch (e) {
            logger.error("getCases")
            logger.error(e);
            res.status(500);
            res.send({ status: "error", msg: e.message });
        }
    }
}