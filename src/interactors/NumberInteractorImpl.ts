import {inject, injectable} from "inversify";
import {INumberInteractor} from "./";
import {ITestRepository} from "../services/repositories/interfaces/ITestRepository";
import {TYPES} from "../dependency-injection/TYPES";

@injectable()
export class NumberInteractorImpl implements INumberInteractor {

    private _testRepo: ITestRepository

    constructor(
        @inject(TYPES.TestRepository) testRepository: ITestRepository
    ) {
        this._testRepo = testRepository
    }

    public async getAccumulatedNumbers(userId: string): Promise<number> {
        let numbers = await this._testRepo.getValues(userId);

        let result = numbers.reduce((prevNumber, currentNumber) => prevNumber + currentNumber, 0);
        return result;
    }

}
