import { Peer } from "./Peer";
import { Chaincode } from "./Chaincode";
import { Orderer } from "./Orderer";
import { Admin } from "./Admin";
import { CA } from "./CA";
import { UserStore } from "./UserStore";
import { Store } from "./Store";

export interface OrganisationModel {
    name: string;
    peers: Peer;
    chaincode: Chaincode[];
    orderer: Orderer;
    admin: Admin;
    ca: CA;
    userStore: UserStore;
    stateStore: Store;
    caCryptoStore: Store;
    clientCryptoStore: Store;
}