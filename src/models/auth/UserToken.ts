import { Organisation} from '../Organisation';
import { Affiliation} from '../Affiliation';
export interface UserToken {
  id: string,
  username: string,
  organisation?: Organisation
  affiliation?: Affiliation
}