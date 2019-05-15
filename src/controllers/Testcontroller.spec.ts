import "ts-jest";
import "reflect-metadata";
import {ITestController} from "./interfaces/ITestController";
import {container} from "../dependency-injection/inversify.config";

import {ITestRepository} from "../services/repositories/interfaces/ITestRepository";
import {TestRepositoryMock} from "../services/repositories/TestRepositoryMock";
import {INumberInteractor} from "../interactors";
import {TYPES} from "../dependency-injection/TYPES";
import {NumberInteractorImpl} from "../interactors/NumberInteractorImpl";


/*
container.rebind<ITestRepository>(TYPES.TestRepository).to(TestRepositoryMock);
const interactor: INumberInteractor = container.get<INumberInteractor>(TYPES.NumberInteractor);
*/

// @ts-ignore
let mockRep = jest.fn<ITestRepository>(() => ({
    getValues: jest.fn().mockImplementation((id:string) => new Promise(res => res([1, 2, 3])))
}));
const interactor = new NumberInteractorImpl(new mockRep());

describe("test controller", () => {



    test("calculate", async () => {
        let test = [1,2,3];
        let result = await interactor.getAccumulatedNumbers("1");
        expect(result).toBe(6);
    });


})
