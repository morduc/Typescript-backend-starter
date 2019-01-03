import { UserToken } from "../../models/auth/userToken";
import { OrganisationModel } from "../../models/organisation/OrganisationModel";
import { SearchModel } from "../../models/search/SearchModel";

export interface IOrganisationService {

    //getAllBatchesPagination(user: UserTokenModel, search: SearchModel): Promise<any>;

    getAllOrganisations(user: UserToken, search: SearchModel): Promise<any>;

    getOrganisationById(user: UserToken, id: string): Promise<any>;

    //getBatchHistory(user: UserTokenModel, id: string): Promise<any>;

    createOrganisation(user: UserToken, organisation: OrganisationModel): Promise<any>;

    // updateBatch(user: UserTokenModel, batch: BatchModel): Promise<any>;

    // deleteBatch(user: UserTokenModel, id: string): Promise<any>;

}