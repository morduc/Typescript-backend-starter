export interface INumberInteractor {
    getAccumulatedNumbers(userId: string): Promise<number>;
}
