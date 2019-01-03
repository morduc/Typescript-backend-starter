import { User } from "fabric-client";
import { UserRegistrationRequest } from "../../models/auth/UserRegistrationRequest";

export interface IAuthenticationService {

    signIn(username: string, password: string): object;

    registerUser(req: UserRegistrationRequest): Promise<User>

    verifyJwtToken(token: string): string | object;

    getUsers(orgs: string[]): Promise<any>;
}