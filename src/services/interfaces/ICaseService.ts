import { UserToken } from "../../models/auth/userToken";
import { SearchModel } from "../../models/search/SearchModel";
import { ICreateCase } from "../../models/case/ICreateCase";
import { IUpdateCase } from "../../models/case/IUpdateCase";
import { ICasePart } from "../../models/case/ICasePart";
import { IUpdateCasePart } from '../../models/Case/IUpdateCasePart';
import { ICase } from "../../models/case/ICase";
export interface ICaseService {

    //getAllBatchesPagination(user: UserTokenModel, search: SearchModel): Promise<any>;

    getAllCases(user: UserToken, search: SearchModel): Promise<ICase[]>;

    getAllCaseParts(user: UserToken, search: SearchModel): Promise<ICasePart[]>;

    getCaseById(user: UserToken, id: string): Promise<any>;

    
    createCase(user: UserToken, newCase: ICreateCase): Promise<any>;

    updateCase(user: UserToken, updateCase: IUpdateCase): Promise<any>;

    getCaseHistory(user: UserToken, id: string): Promise<any>;

    updateCasePart(user: UserToken, updateCasePart: IUpdateCasePart): Promise<any>;



}