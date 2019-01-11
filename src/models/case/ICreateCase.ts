import { ICase } from "./ICase";
import { IFoodItem } from "./IFoodItem";
import { ICasePart } from "./ICasePart";

export interface ICreateCase {
    case: ICase;
    foodItem: IFoodItem;
    casePart: ICasePart
    nextParts: ICasePart[]
}

