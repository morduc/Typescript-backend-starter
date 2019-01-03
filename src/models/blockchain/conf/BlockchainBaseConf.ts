
import { OrganisationModel } from "../organisation/Organisation";
import { chaincodesModel } from "../organisation/Chaincodes";

export interface BlockchainBaseConf {
    channelName: string,
    chaincodes: chaincodesModel[],
    organisation: OrganisationModel
}