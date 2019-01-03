import { IUserStore } from "./interfaces/IUserStore";
import { UserDB } from "../../models/db/userDB";
import { ICouchDBStore } from "./interfaces/iCouchDBStore";

import { logger } from '../../utils/logger';
import { injectable, inject } from "inversify";
import { TYPES } from "../../dependency-injection/types";
import { organisationRouter } from "../../routes/organisationRouter";
import { Store } from "tough-cookie";
import { userInfo } from "os";

@injectable()
export class UserStore implements IUserStore {

    private store: ICouchDBStore;

    constructor(@inject(TYPES.CouchDBStore) store?: ICouchDBStore) {
        this.store = store;
        this.store.setupDB();
    }

    public async getUser(username: string): Promise<UserDB> {
        logger.info("UserStore - getUser: ", username);

        const result = await this.store.getValue(username);
        logger.debug("getUser: result", result);
        if (result && result.hasOwnProperty("data")) {
            return result.data;
        }
        return result;
    }

    public async getUsers(orgs: string[]){
        logger.info("UserStore - getUsers");
        logger.info(orgs);

        let query:any = {
            selector: {
                data: {appType: "member",
            }
                // data: {
                //     appType: "member",

                // }
            },
            fields: ["data.username", "data.affiliation"]
        }

        // if(orgs.length > 0){
        //     query.selector.data.affiliation = {
        //         name: {
        //             $in: orgs
        //         }
        //     }
        // }

        let result = await this.store.find(query);
        
        logger.info("UserStore result:")
        logger.info(JSON.stringify(result));
        logger.info(result);
        return result.docs;
    }
    public async removeUser(username: string): Promise<UserDB> {
        logger.info("UserStore - removeUser: ", username);
        const result = await this.store.deleteValue(username);
        return result;
    }

    public async createUser(user: UserDB): Promise<any> {
        logger.info("UserStore - createUser: ", user);
        return await this.store.setValue(user.username, user);
    }

}