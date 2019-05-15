import { ITestRepository } from "./interfaces/ITestRepository";
import {injectable} from "inversify";
import {Test} from "../../models/Test/Test";

@injectable()
export class TestRepositoryMock implements ITestRepository {

  // just testing a service
  public getValues(id: string): Promise<number[]> {
    // This is a mock implementation. All the same functions as the real impl.
    // Enforced by the Interface (ITestRepository)

    return new Promise((resolve) =>  resolve([3, 2, 1]));
  }
}
