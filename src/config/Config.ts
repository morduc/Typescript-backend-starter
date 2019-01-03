import  dotenv from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

dotenv.config();

export class Config {

    private static ip: string = "localhost"
    
    public static conf: any = {

        stage: process.env.STAGE,

        log: {
            level: process.env.LOG_LEVEL
        },

        auth: {
            jwtSecret: process.env.AUTH_SECRET,
            adminSecret: process.env.AUTH_ADMIN_SECRET
        },

        blockchain: {

            channel: {
                name: "default",
            },

            chaincodes:[
                { id: "c1" }
            ],

            orgs: [

                {
                    name: "bachelor.dtu.org",
                    type: "member",
                    peers:[
                        {
                            host: "bachelor.dtu",
                            url: `grpcs://${Config.ip}:8001`,
                            publicKey: readFileSync(resolve("./resources/certs/peer0.pem")).toString()
                        },
                        {
                           host: "bachelor.dtu",
                           url: `grpcs://${Config.ip}:8002`,
                           publicKey: readFileSync(resolve("./resources/certs/peer1.pem")).toString()
                        },
                        {
                           host: "bachelor.dtu",
                           url: `grpcs://${Config.ip}:8003`,
                           publicKey: readFileSync(resolve("./resources/certs/peer2.pem")).toString()
                        }
                    ],

                    chaincode: [
                        { id: "c1" }
                    ],

                    orderer:{
                        host: 'orderer0',
                        url: `grpcs://${Config.ip}:7000`,
                        publicKey: readFileSync(resolve("./resources/certs/orderer0.pem")).toString()
                    },

                    admin:{
                        publicKey: readFileSync(resolve("./resources/certs/Admin@public-key.pem")).toString(),
                        privateKey: (process.env.STAGE !== "dev" ? process.env.BC_CA_ADMIN_PRIVATE_KEY : readFileSync(resolve("./resources/certs/Admin@private-key.pem")).toString())
                    },

                    ca:{
                        host: "bachelor.dtu.org",
                        url: `https://${Config.ip}:7050`,
                        mspId: 'BachelorDTUMSP'
                    },

                    userStore: {
                        name: "bachelor_dtu_user_db",
                        host: process.env.USERSTORE_DB_HOST,
                        username: process.env.USERSTORE_DB_USERNAME,
                        password: process.env.USERSTORE_DB_PASSWORD
                    },

                    stateStore:{
                        name: 'state_member_db',
                        url: `https://${process.env.ARTIFACT_DB_USERNAME}:${process.env.ARTIFACT_DB_PASSWORD}@${process.env.ARTIFACT_DB_HOST}`
                    },

                    caCryptoStore:{
                        name: 'crypto_db',
                        url: `https://${process.env.ARTIFACT_DB_USERNAME}:${process.env.ARTIFACT_DB_PASSWORD}@${process.env.ARTIFACT_DB_HOST}`
                    },

                    clientCryptoStore: {
                        name: 'crypto_db',
                        url: `https://${process.env.ARTIFACT_DB_USERNAME}:${process.env.ARTIFACT_DB_PASSWORD}@${process.env.ARTIFACT_DB_HOST}`
                    }

                },

            ]

        }


    };
    
    public static currentOrg: any = Config.conf.blockchain.orgs[0];
}