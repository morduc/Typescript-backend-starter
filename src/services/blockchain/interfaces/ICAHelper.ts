import FabricClient, { User } from "fabric-client";

import { IEnrollmentRequest, IRevokeRequest, IRegisterRequest } from "fabric-ca-client"

export interface ICAHelper {

    registerUser(registrarUser: User,
                 regReq: IRegisterRequest): Promise<string>;

    enrollUser(client: FabricClient,
               enrollReq: IEnrollmentRequest): Promise<User>;

    getEnrolledUser(client: FabricClient,
                    enrollmentID: string): Promise<User | null>;

    reenroll(client: FabricClient,
             enrollmentID: string): void;

    revoke(client: FabricClient, admin: User, revokeRequest: IRevokeRequest):Promise<any>;

    registerAndEnroll(client: FabricClient,
                      registrarUser: User,
                      regReq: IRegisterRequest,
                      enrollReq: IEnrollmentRequest): any;


}