import { IBaseBCClient } from "./iBaseBCClient";
import { InvokeRequest } from "../../../models/blockchain/request/invokeRequest";

export interface IMemberClient extends IBaseBCClient {

    invoke(req: InvokeRequest): Promise<any>

    query(req: InvokeRequest): Promise<any>;
}