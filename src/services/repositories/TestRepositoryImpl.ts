import { ITestRepository } from "./interfaces/ITestRepository";
import {injectable} from "inversify";
import {Test} from "../../models/Test/Test";

@injectable()
export class TestRepositoryImpl implements ITestRepository {

    // just testing a service
    public getValues(id: string): Promise<number[]> {
        // This calls a rest api and returns the response.
        // We cannot call this from test
        return new Promise((resolve, reject) =>  reject("no connection to api/database"));
    }
}
