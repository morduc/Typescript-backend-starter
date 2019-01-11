import { UserToken } from "../../models/auth/userToken";
import { IFoodItem } from "../../models/case/IFoodItem";

export interface IFoodItemService {


 
    getFoodItemById(user: UserToken, id: string): Promise<any>;

    getAllFoodItems(user: UserToken, searchModel: any): Promise<IFoodItem[]>;
    getFoodItemHistory(user: UserToken, id: string): Promise<any>;

    updateFoodItem(user: UserToken, foodItem: IFoodItem): Promise<any>;


}