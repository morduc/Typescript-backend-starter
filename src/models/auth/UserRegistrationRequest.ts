import { Affiliation } from "../Affiliation";
import { Organisation } from "../Organisation";

const APPTYPES = ["systemAdmin", "member"]
export class UserRegistrationRequest {

    public username: string;
    public password: string;

    public affiliation: Affiliation;
    public organisation: Organisation;
    public appType: string



    constructor(
      username: string = "", 
      password: string = "", 
      org: Organisation = {id: "", name:""}, 
      affiliation: Affiliation = {id:"", name: ""},
      appType: string
    ){
      this.username = username;
      this.password = password;
      this.organisation = org;
      this.affiliation = affiliation;
      this.appType = appType;
    }

    isUserRegistrationReqValid(): boolean {
        return this.isUsernameValid() && this.isPasswordValid() && this.isAffiliationValid() && this.isOrgValid() && this.isAppTypeValid();
    }

    isUsernameValid(): boolean{
        return this.username !== undefined && this.username !== null && this.username !== "";
    }

    isPasswordValid(): boolean{
        return this.password !== undefined && this.password !== null && this.password !== "";
    }

    isOrgValid(): boolean{
        return this.organisation !== undefined
            && this.organisation.hasOwnProperty("id")
            && this.organisation.hasOwnProperty("name")
            && this.organisation.id !== ""
            && this.organisation.name !== "";
    }

    isAffiliationValid(): boolean{
        return this.affiliation !== undefined
            && this.affiliation.hasOwnProperty("id")
            && this.affiliation.hasOwnProperty("name")
            && this.affiliation.id !== ""
            && this.affiliation.name !== "";
    }

    isAppTypeValid(): boolean {
        return APPTYPES.indexOf(this.appType) >= 0;
    }



}