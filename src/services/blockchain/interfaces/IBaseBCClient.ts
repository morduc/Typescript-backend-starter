export interface IBaseBCClient {

  getBlocks(noOfLastBlocks: number): Promise<any>;

  getTransactionDetails(txId: string): Promise<any>;

  initEventHubs(): void;

}