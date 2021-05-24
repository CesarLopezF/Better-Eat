export interface Product {
    key: string;
    name: string;
    category: string;
    imgURL: string;
    nutritionalInfo: Array<string>;
    ingredients: string;
    price: number;
    dateAdded: Date;
    score: number;
    healthy: boolean;
}
