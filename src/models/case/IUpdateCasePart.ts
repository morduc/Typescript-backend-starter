
import { ICasePart } from './ICasePart'
export interface IUpdateCasePart {
    casePart: {
        id: string;
        caseId: string;
        owner: string;
        state: string;
        prevPart: string;
        nextParts?: string[];
    }
    nextParts: ICasePart[]
}