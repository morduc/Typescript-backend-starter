import { BlockchainCAConf } from "./BlockchainCAConf";
import { UserStore} from '../organisation/UserStore';
import { Store } from '../organisation/Store';
export interface OrganisationConf {
    name: string;
    //admin: { publicKey: string, privateKey: string },
    ca: BlockchainCAConf;
    userStore: UserStore;
    stateStore: Store;
    caCryptoStore: Store
    clientCryptoStore: Store;
}