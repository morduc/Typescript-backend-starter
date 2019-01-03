import { IRegisterRequest } from "fabric-ca-client";
import { User } from "fabric-client";

export interface IRegistrationClient {

    registerUser(req: IRegisterRequest): Promise<User>;
    revokeUser(enrollmentId: string): Promise<any>
    reenroll(enrollmentId: string): Promise<any>

    prepare(): Promise<void>;
}