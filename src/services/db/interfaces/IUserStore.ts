import { UserDB } from "../../../models/db/UserDB"

export interface IUserStore {
    getUser(username: string): Promise<UserDB>
    removeUser(username: string): Promise<UserDB>
    createUser(user: UserDB): Promise<any>
    getUsers(orgs: string[]): Promise<any>
}