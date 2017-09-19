export interface IProductAttributeValue {
    id: number;
    value: string;
}

export interface IProductAttribute {
    id: number;
    name: string;
    description: string;
    productAttributeValues: IProductAttributeValue[];
}

export interface IProductMetaData {
    categories: any[];
    productAttributes: IProductAttribute[];
}