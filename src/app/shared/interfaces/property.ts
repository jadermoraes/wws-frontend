export interface Property {
    id: string;
    createdBy: string;
    createdByFullName: string;
    userId: string | null;
    userFullName: string | null;
    zipCode: string;
    propertyNumber: string;
    propertyLetter?: string;
    propertyNumberAddition?: string;
    streetName: string;
    place: string;
    monumental: boolean;
    currentRent: number;
    reference?: string;
    picture?: string;
}