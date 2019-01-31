import { NextFunction, Request, Response, Application } from 'express';

import { IOrganisationController } from './interfaces/IOrganisationsController';
import { IOrganisationService } from '../services/interfaces/IOrganisationService';
import { injectable, inject } from 'inversify';
import { TYPES } from '../dependency-injection/types';
import { logger } from '../utils/logger';

@injectable()
export class OrganisationControllerImpl implements IOrganisationController {
    private CTRL_TYPE:string = "OrganisationController"
    private service: IOrganisationService;

    constructor(@inject(TYPES.OrganisationService) service: IOrganisationService){
        this.service = service
    }


    public async postCreateOrganisation(req: any, res: Response, next: NextFunction){
        logger.debug(this.CTRL_TYPE + " postCreateOrganisation" + req.body)

        try {
            let org = req.body;
            org = await this.service.createOrganisation(req.user, org);

            res.json({status: "ok", msg: `Organisation with id '${org.id}' has been created`, organisation: org})
        } catch(e) {
            logger.error(e);
            res.status(500);
            res.json({status: "error", msg: e.message});
        }
    }

    public async getOrganisation(req: any, res: Response, next: NextFunction) {
        logger.debug(this.CTRL_TYPE + " getOrganisation" + req.params.id)
        
        try {
            let orgId = req.params.id;

            const result = await this.service.getOrganisationById(req.user, orgId);

            if(result && result.organisation) {
                res.json({status: "ok", organisation: result.organisation})
            } else {
                res.status(404);
                res.json({status: "error", msg: `Did not find organisation with id '${orgId}'`});
            }
        } catch(e){
            logger.error(e);
            res.status(500);
            res.json({ status: "error", msg: e.message})
        }
    }

    public async getOrganisations(req: any,res: Response, next: NextFunction){
        logger.debug(this.CTRL_TYPE + " getOrganisations" + req.body)
            
        try{
                // Basic searchmodel
                let searchModel:any= {
                    query: {
                        selector:{
                            docType: "organisation"                     
                        }
                    }
                }


                // adding selected ids
                if(req.query.ids){

                    let ids = JSON.parse(req.query.ids);
                    searchModel.query.selector.id = {
                        $in: ids
                    }   
                }

            // if(!this.validator.isValidWithDoctype(searchModel, DocTypeEnum.BATCH)){
            //     return res.send({ status: "error", msg: "Invalid selector provided docType batch required"});
            // }
            console.log(JSON.stringify(searchModel));
            let orgs = [];
            // if(this.validator.isMetaCorrect(searchModel))
            //     batches = await this.interactor.getAllBatchesPagination(req.user, searchModel);
            // else
                orgs = await this.service.getAllOrganisations(req.user, searchModel);


            if(orgs && orgs.meta && orgs.result && orgs.result.length > 0)
                res.send({ status: "ok", result: orgs.result, meta: orgs.meta });
            else if(orgs && orgs.result && orgs.result.length > 0)
                res.send({ status: "ok", result: orgs.result });
            else
                res.send({ status: "ok", result: [] });

        }
        catch (e) {
            logger.error(this.CTRL_TYPE + " getOrganisations")
            logger.error(e);
            res.status(500);
            res.send({ status: "error", msg: e.message });
        }
    }
}