export interface ICasePart {
    id?: string;
    caseId?: string;
    owner: string;
    state: string;
    prevPart: string;
    nextParts?: string[];
}
