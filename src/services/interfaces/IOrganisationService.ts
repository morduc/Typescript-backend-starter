import { UserToken } from "../../models/auth/userToken";
import { OrganisationModel } from "../../models/organisation/OrganisationModel";
import { SearchModel } from "../../models/search/SearchModel";

export interface IOrganisationService {


    getAllOrganisations(user: UserToken, search: SearchModel): Promise<any>;

    getOrganisationById(user: UserToken, id: string): Promise<any>;


    createOrganisation(user: UserToken, organisation: OrganisationModel): Promise<any>;

}