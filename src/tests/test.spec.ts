import 'ts-jest';
import { myContainer } from "../inversify.config";
import { TYPES } from "../types";
import { IArea } from '../interface';

const square = myContainer.get<IArea>(TYPES.IArea);

describe('Global test', () => {
    test('inversify', async () => {
        expect(square.calculateArea()).toBe(16);
    });
});