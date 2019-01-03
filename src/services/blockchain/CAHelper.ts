import CAClient, {IRevokeRequest, IRegisterRequest, IEnrollmentRequest, IKey} from 'fabric-ca-client';
import FabricClient, { ICryptoSuite, User, CryptoContent} from 'fabric-client';

import { ICAHelper } from "./interfaces/iCAHelper";
import { BlockchainCAConf } from "../../models/blockchain/conf/BlockchainCAConf";

import { logger } from "../../utils/logger";

export class CAHelper implements ICAHelper {

    private _ca: CAClient;
    private _mspId: string;
    private _caName: string;
    private _cryptosuit: ICryptoSuite;

    constructor(conf: BlockchainCAConf, cryptosuit: ICryptoSuite, ca?: CAClient){

        this._mspId = conf.mspId;
        this._caName = conf.host;
        this._cryptosuit = cryptosuit;

        if(!ca){
            const tlsOptin = { trustedRoots: Buffer.alloc(1), verify: false };
            this._ca = new CAClient(conf.url, tlsOptin, this._caName, this._cryptosuit);
        }
        else {
            this._ca = ca;
        }
    }

    async registerUser(registrarUser: User, regReq: IRegisterRequest | undefined): Promise<string>{

        if(!regReq || !regReq.enrollmentID || regReq.enrollmentID === "" || !regReq.enrollmentSecret || regReq.enrollmentSecret === ""){
            throw new Error("Failed to register user. enrollmentID and/or enrollmentSecret not valid");
        }

        logger.info(`Trying to register user: ${regReq.enrollmentID} with enrollment secret: ${regReq.enrollmentSecret}. To affiliation: ${regReq.affiliation}`);

        try{
            regReq.enrollmentSecret =  await this._ca.register(regReq, registrarUser);
        }
        catch (e) {
            throw new Error(`Failed to register user: ${regReq.enrollmentID}. ${e.message}`);
        }

        logger.info(`Registered user: ${regReq.enrollmentID} with the enrollment secret: ${regReq.enrollmentSecret}`);
        return regReq.enrollmentSecret;
    }

    async enrollUser(client: FabricClient, enrollReq: IEnrollmentRequest){

        let enrolledUser: any;

        try{
            enrolledUser = await this.getEnrolledUser(client, enrollReq.enrollmentID);

            if(enrolledUser){
                return enrolledUser;
            }

            logger.info("User: " + enrollReq.enrollmentID + " not enrolled.");
            logger.info("Trying to enroll user: " + enrollReq.enrollmentID);

            const enrollment = await this._ca.enroll(enrollReq);

            const cryptoContent: CryptoContent = {
                privateKeyPEM: enrollment.key.toBytes(),
                signedCertPEM: enrollment.certificate,
            };

            const userOptions: FabricClient.UserOpts = {
                username: enrollReq.enrollmentID,
                mspid: this._mspId,
                cryptoContent: cryptoContent,
                skipPersistence: false
            };

            enrolledUser = await client.createUser(userOptions);

            await enrolledUser.setEnrollment(enrollment.key,
                enrollment.certificate,
                this._mspId);

            await client.setUserContext(enrolledUser);

            return enrolledUser;
        }
        catch (e) {
            throw new Error(`Failed to enroll user: ${enrollReq.enrollmentID}. ${e.message}`);
        }

    }

    async getEnrolledUser(client: FabricClient, enrollmentID: string): Promise<User | null>{

        let userContext: User;

        logger.info("Getting enrolled user: " + enrollmentID);
        try{
            userContext = await client.getUserContext(enrollmentID, true);
        }
        catch (e) {
            throw new Error("Not able to get user context. " + e.message);
        }

        if(userContext && userContext.isEnrolled()){
            return userContext;
        }

        return null;
    }

    async reenroll(client?: FabricClient, enrollmentID?: string): Promise<void> {

        if(!client || !enrollmentID || enrollmentID === ""){
            throw new Error("Invalid id or client");
        }

        try {

            const enrolledUser = await this.getEnrolledUser(client, enrollmentID);

            if(!enrolledUser){
                throw new Error("User: " + enrollmentID + " not found. Cannot reenroll.");
            }

            logger.info("Found user: " + enrollmentID);

            const att: CAClient.IAttributeRequest[] = [{
                name: enrollmentID,
                optional: false
            }];
            const enrollment: CAClient.IEnrollResponse = await this._ca.reenroll(enrolledUser, att);

            await enrolledUser.setEnrollment(enrollment.key,
                enrollment.certificate,
                this._mspId);

            await client.setUserContext(enrolledUser, false);

        }
        catch (e) {
            throw new Error("Failed to reenroll user: " + enrollmentID);
        }

    }

    async revoke(client?: FabricClient,  admin?: User, revokeRequest?: IRevokeRequest): Promise<any> {

        if(!client || !admin || !revokeRequest) {
            throw new Error(`Invalid client, id or reason`);
        }

        try{
            const revocation = await this._ca.revoke(revokeRequest, admin);
            logger.debug("What is the revocation: " + revocation);
            return revocation
        }catch (e) {
            throw(e);
        }

    }

    async registerAndEnroll(client: FabricClient, admin: User, regReq: IRegisterRequest, enrollReq: IEnrollmentRequest){

        if(!regReq || !regReq.enrollmentID || regReq.enrollmentID === "" || !enrollReq.enrollmentID || enrollReq.enrollmentID === "")
            throw new Error("Invalid parameters!");

        let enrolledUser;
        try{
            enrolledUser = await this.getEnrolledUser(client, regReq.enrollmentID);
        }catch (e) {
            logger.error("Error: ", {error: e.message});
        }

        if(enrolledUser){
            return;
        }

        try{
            enrollReq.enrollmentSecret = await this.registerUser(admin, regReq)
        }catch (e) {
            logger.info("Failed to register user: " + regReq.enrollmentID + ". " + e.message);
            throw new Error("Failed to register user");
        }

        return await this.enrollUser(client, enrollReq);
    }



}