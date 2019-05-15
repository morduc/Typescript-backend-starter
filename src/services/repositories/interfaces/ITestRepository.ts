import {Test} from "../../../models";

export interface ITestRepository {
  getValues(id: string): Promise<number[]>;
}
