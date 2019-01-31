import { EventEmitter } from "events";

import Hfc, {
    ChaincodeInvokeRequest,
    ChaincodeQueryRequest,
    Channel,
    Orderer,
    Peer
} from "fabric-client";

import Long = require("long");

import { BlockchainBaseConf } from "../../models/blockchain/conf/BlockchainBaseConf";
import { IBaseBCClient } from "./interfaces/iBaseBCClient";
import { ICAHelper } from "./interfaces/iCAHelper";
import { CAHelper } from "./caHelper";
import { Utils } from '../../Utils/Utils';
import { InvokeRequest } from "../../models/blockchain/request/invokeRequest";


import { logger } from '../../utils/logger';

export class BaseBCClient extends EventEmitter implements IBaseBCClient {

    protected _client: Hfc;
    protected _channel: Channel;
    protected _organisation: any;
    protected _chaincodes: any[] = [];
    protected _peers: Peer[] = [];
    protected _ca?: ICAHelper;


    constructor(conf: BlockchainBaseConf, client?: Hfc, channel?: Channel){
        super();

        if(!client)
            this._client = new Hfc();
        else
            this._client = client;

        if(!channel)
            this._channel = this._client.newChannel(conf.channelName);
        else
            this._channel = channel;

        this._setOrganisation(conf.organisation);
        this._setChaincodes(conf.chaincodes);
        this._setOrderer();
        this._setPeers();
    }

    protected async _invoke(req: InvokeRequest) {
        logger.debug("INVOKE CHAINCODE function");
        let proposalResponses, proposal;
        const txId = this._client.newTransactionID();

        try {

            const invokeReq: ChaincodeInvokeRequest = {
                chaincodeId: req.chaincodeId,
                fcn: req.fcn,
                args: Utils.marshalArgs(req.args),
                txId: txId
            };

            const results = await this._channel.sendTransactionProposal(invokeReq);

            proposalResponses = results[0]; // []
            proposal = results[1]; // {}
            logger.info("RESPONSES FROM PEERS: " + proposalResponses.length);
            // Check if all peers agree on proposal
            const allGood = proposalResponses.every((pr:any) => pr.response && pr.response.status === 200);

            if (!allGood) {
                throw new Error(`Proposal rejected by some (all) of the peers: ${proposalResponses}`);
            }
        } catch (e) {
            throw e;
        }

        try {
            const request = { proposalResponses, proposal };

            const transactionId = txId.getTransactionID();

            const transactionCompletePromises = [ this._handleTxEvents(transactionId) ];

            transactionCompletePromises.push(this._channel.sendTransaction(request));
            try {
                await transactionCompletePromises;
                const payload = proposalResponses[0].response.payload;
                return Utils.unmarshalResult([payload]);
            } catch (e) {
                throw e;
            }
        } catch (e) {
            throw e;
        }

    }

    protected async _query(req: ChaincodeQueryRequest) {
        logger.debug("QUERY CHAINCODE function");
        req.args = Utils.marshalArgs(req.args);
        req.targets = [ this._peers[0] ]; // Query 1 peer only

        let response = await this._channel.queryByChaincode(req);

        // Logging of each peer response
        /*for(let i = 0; i < response.length; i++) {
            logger.debug(`Query result from peer${i}: ${response[i].toString('utf8')}`);
        }*/

        return Utils.unmarshalResult( [ response[0] ]);
    }

    public async getBlocks(noOfLastBlocks: number) {

        const { height } = await this._channel.queryInfo();

        let blockCount: any;

        if (height.comp(noOfLastBlocks) > 0) {
            blockCount = noOfLastBlocks;
        } else {
            blockCount = height;
        }

        if (typeof blockCount === 'number') {
            blockCount = Long.fromNumber(blockCount, height.unsigned);
        } else if (typeof blockCount === 'string') {
            blockCount = Long.fromString(blockCount, height.unsigned);
        }

        blockCount = blockCount.toNumber();

        const queryBlock = this._channel.queryBlock.bind(this._channel);
        const blockPromises: any = {};

        blockPromises[Symbol.iterator] = function* () {
            for (let i = 1; i <= blockCount; i++) {
                yield queryBlock(height.sub(i).toNumber());
            }
        };

        const blocks = await Promise.all([...blockPromises]);

        return blocks.map(Utils.unmarshalBlock);
    }

    public async getTransactionDetails(txId: string) {

        try {
            let transactionData:any = await this._channel.queryTransaction(txId);

            transactionData = transactionData ? transactionData.transactionEnvelope.payload.data.actions : "";

            const execution_response = transactionData !== "" ? transactionData[0].payload.action.proposal_response_payload.extension.response : "";

            return { txId: txId, results: execution_response };
        } catch(e) {
            throw e;
        }
    }

    public async initializeStoresAndCA(ca?: ICAHelper): Promise<any> {

        try {
            Hfc.setConfigSetting("key-value-store","fabric-client/lib/impl/CouchDBKeyValueStore.js");

            const stateOptions =  {
                path: "../../../resources",
                name: this._organisation.stateStore.name,
                url: this._organisation.stateStore.url
            };
            const stateKeyStore = await Hfc.newDefaultKeyValueStore(stateOptions);
            await this._client.setStateStore(stateKeyStore);

            const clientCryptoOptions = {
                path: "../../../resources",
                name: this._organisation.clientCryptoStore.name,
                url: this._organisation.clientCryptoStore.url
            };
            const clientCryptoSuite = Hfc.newCryptoSuite();
            const clientCryptoStore = Hfc.newCryptoKeyStore(clientCryptoOptions);

            clientCryptoSuite.setCryptoKeyStore(clientCryptoStore);

            this._client.setCryptoSuite(clientCryptoSuite);

            const caCryptoOptions =  {
                path: "../../../resources" ,
                name: this._organisation.caCryptoStore.name,
                url: this._organisation.caCryptoStore.url
            };
            const caCryptoSuite = Hfc.newCryptoSuite();
            const caCryptoStore = Hfc.newCryptoKeyStore(caCryptoOptions);

            caCryptoSuite.setCryptoKeyStore(caCryptoStore);

            if(!ca){
                this._ca = new CAHelper(this._organisation.ca, caCryptoSuite);
            }
            else
                this._ca = ca;

        } catch(e) {
            logger.error(`Failed to enroll admin user. Error: ${e.message}`);
            throw e;
        }

    }

    public initEventHubs() {

        // Setup event hubs
        try {

            // TODO: 1.3.0
            const eventHub = this._channel.newChannelEventHub(this._peers[0]);

            eventHub.registerBlockEvent((block: any) => {
                logger.debug('block', Utils.unmarshalBlock(block));
                this.emit('block', Utils.unmarshalBlock(block));
            }, (err) => {
                logger.debug(err);
            });

            eventHub.connect(true);

        } catch (e) {
            logger.error(`Failed to configure event hubs. Error ${e.message}`);
            throw e;
        }
    }

    // TODO
    protected _handleTxEvents(txId: any): Promise<any> {
        const eh = this._channel.getChannelEventHub(this._peers[0].getName());
        eh.connect();

        return new Promise((resolve, reject) => {
            // Set timeout for the transaction response from the current peer
            const responseTimeout = setTimeout(() => {
                eh.unregisterTxEvent(txId);
                reject(new Error('Peer did not respond in a timely fashion!'));
            }, 120000);

            eh.registerTxEvent(txId, (tx:any, code:any) => {
                clearTimeout(responseTimeout);
                eh.unregisterTxEvent(txId);
                if (code !== 'VALID') {
                    reject(new Error( `Peer has rejected transaction with code: ${code}`));
                } else {
                    resolve();
                }
            });
        });
    }



    private _setOrganisation(organisation: object){
        this._organisation = organisation;
    }

    private _setChaincodes(chaincodes: any[]) {

        for(let chain of chaincodes){

            for(let orgChain of this._organisation.chaincode){
                if(orgChain.id === chain.id)
                    this._chaincodes.push(chain);
            }
        }
    }

    private _setOrderer(){
        const ordererOptions: object = {
            pem: this._organisation.orderer.publicKey,
            'ssl-target-name-override': this._organisation.orderer.host
        };

        const orderer: Orderer = new Orderer(this._organisation.orderer.url, ordererOptions);

        this._channel.addOrderer(orderer);
    }

    private _setPeers(){
        for(let p of this._organisation.peers){

            const peerOptions: object = {
                pem: p.publicKey,
                'ssl-target-name-override': p.host
            };

            const peer = new Peer(p.url, peerOptions);
            this._peers.push(peer);

            this._channel.addPeer(peer, this._organisation.ca.mspId);
        }
    }

}