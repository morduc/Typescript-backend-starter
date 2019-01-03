import { MemberClient } from "../../services/blockchain/memberClient";
import { Config } from "../../config/config";
import { BlockchainBaseConf } from "../blockchain/conf/BlockchainBaseConf";
import { IMemberClient } from "../../services/blockchain/interfaces/iMemberClient";


export default class MemberClientFactory {

    static generateClient(enrollmentId: string): IMemberClient {

        const conf: BlockchainBaseConf = {
            channelName: Config.conf.blockchain.channel.name,
            chaincodes: Config.conf.blockchain.chaincodes,
            organisation: Config.currentOrg
        };

        return new MemberClient(conf, enrollmentId);
    }

}