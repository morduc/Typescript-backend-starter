import nano, { DocumentScope } from 'nano';
import util from 'util';
import { ICouchDBStore } from "./interfaces/iCouchDBStore";
import { StoreConfig } from "../../models/db/storeConfig";

import { logger } from "../../utils/logger";
import { injectable } from 'inversify';

@injectable()
export default class CouchDBStore implements ICouchDBStore {

    private url: string = "";
    private name: string = "";

    private database?: DocumentScope<any>;

    constructor(conf: StoreConfig, db?: DocumentScope<any>) {
        this.setOptions(conf, db);
    }

    public getValue(key: string): Promise<any> {

        logger.debug('getValue for key: ', key);
        return this.dbReadBody(key).then((body: any) => {
            logger.debug('getValue: %s, Retrieved message from %s.', key, this.name);
            return Promise.resolve(body);
        }).catch((err: any) => {
            if (err.error !== 'not_found') {
                logger.error('getValue: %s, ERROR: [%s.get] - ', key, this.name, err.error);
                return Promise.reject(err.error);
            }
            else {
                logger.debug('getValue: %s, Entry does not exist', key);
                return Promise.resolve();
            }
        });
    }

    public setValue(key: string, value: any): Promise<any> {

        logger.debug('setValue for key: ', key);

        return new Promise((resolve, reject) => {

            // Retrieve from database to see if entry exists
            this.dbReadBody(key).then((body: any) => {

                // Entry already exists and must be updated -> update entry using latest revision
                logger.debug('setValue: %s, Retrieved entry from %s. Latest rev number: %s', key, this.name, body._rev);

                this.dbInsert({ _id: key, _rev: body._rev, data: value }).then(status => {
                    logger.debug('setValue update: ' + key + ', status: ' + status);
                    resolve(value);
                }).catch(err => {
                    reject(new Error('Couch database insert update failed - ' + err.message));
                });

            }).catch((err: any) => {

                if (err.error !== 'not_found') {
                    logger.error('setValue: %s, ERROR: [%s.get] - ', key, this.name, err.error);
                    reject(err.error);
                }
                else {
                    // Entry does not exist
                    logger.debug('setValue: %s, Entry does not exist, insert it.', key);

                    this.dbInsert({ _id: key, data: value }).then((status: any) => {
                        logger.debug('setValue update: ' + key + ', status: ' + status);
                        resolve(value);
                    }).catch((err: any) => {
                        reject(new Error('Couch database insert update failed - ' + err.message));
                    });
                }
            });
        });
    }

    public deleteValue(key: string) {

        logger.debug('deleteValue for key: ', key);

        return new Promise((resolve, reject) => {

            this.dbReadBody(key).then((body: any) => {

                // Entry already exists delete using latest revision
                logger.debug('Retrieved entry from %s. Latest rev number: %s', key, this.name, body._rev);

                this.dbDelete(key, body._rev).then(status => {
                    logger.debug('deleteValue delete: ' + key + ', status: ' + status);
                    resolve(status);
                }).catch(err => {
                    reject(new Error('Couch database delete failed - ' + err.message));
                });
            }).catch(err => {
                logger.error('deleteValue: %s, ERROR: [%s.delete] - ', key, this.name, err.error);
                reject(err.error);
            });
        });
    }

    public setupDB(): Promise<ICouchDBStore> {

        return new Promise((resolve, reject) => {

            // Initialize the CouchDB database client
            const dbClient = nano(this.url);

            // Check if the database already exists. If not, create it.
            dbClient.db.get(this.name, (err: any, body: any) => {

                if (err) {

                    if (err.error === 'not_found') {
                        logger.debug('No %s found, creating %s', this.name, this.name);

                        dbClient.db.create(this.name, (err: any, body: any) => {

                            if (err) {
                                return reject(new Error(util.format('Failed to create %s database due to error: %s', this.name, err.stack ? err.stack : err)));
                            }

                            logger.debug('Created %s database', this.name);
                            this.database = dbClient.use(this.name);
                            resolve(this);
                        });
                    } else {
                        return reject(new Error(util.format('Error creating %s database to store user data: %s', this.name, err.stack ? err.stack : err)));
                    }
                } else {

                    logger.debug('%s already exists', this.name);
                    this.database = dbClient.use(this.name);
                    resolve(this);
                }
            });
        });
    }

    private setOptions(conf: StoreConfig, db?: DocumentScope<any>) {
        this.url = `https://${conf.username}:${conf.password}@${conf.host}`;
        this.name = conf.name;
        this.database = db;
    }

    private dbInsert(options: any) {
        logger.debug('setValue, _dbInsert', options);

        return new Promise((resolve, reject) => {
            this.database!.insert(options, (err: any) => {
                if (err) {
                    logger.error('setValue, _dbInsert, ERROR: [%s.insert] - ', this.name, err.error);
                    reject(new Error(err));
                } else {
                    logger.debug('setValue, _dbInsert, Inserted member into %s.', this.name);
                    resolve(true);
                }
            });
        });
    }

    private dbDelete(id: any, rev: any) {

        logger.debug('_dbDelete', { _id: id, _rev: rev });

        return new Promise((resolve, reject) => {
            this.database!.destroy(id, rev, (err: any, body: any) => {

                if (err) {
                    logger.error('_dbDelete, ERROR: [%s.delete] - ', this.name, err.error);
                    reject(new Error(err));
                } else {
                    logger.debug('_dbDelete, Deleted member from %s.', this.name);
                    resolve(true);
                }
            });
        });
    }

    private dbReadBody(key: string) {
        return new Promise((resolve, reject) => {

            this.database!.get(key, (err: any, body: any) => {
                if (err) {
                    logger.debug('getValue: %s, ERROR: [%s.get] - ', key, this.name, err.error);
                    return reject(err);

                } else {
                    logger.debug('getValue: %s, Retrieved message from %s.', key, this.name);
                    return resolve(body);
                }
            });
        });

    }

    public find(query:any){
        return new Promise((resolve, reject) => {
            this.database!.find(query, (err: any,  res:any) => {
                if(err) {
                    logger.error("find error");
                    return reject(err);
                } else {
                    logger.info("success");
                    return resolve(res);
                }
            })

        })
    }
}