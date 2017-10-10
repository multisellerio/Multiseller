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

 export enum CategoryAttributeType {
    Invalid = 0,
    Simple = 1,
    Variant = 2,
}

 export interface ICategoryAttribute {
    productAttribute: IProductAttribute;
    isRequired: boolean;
    isGroup: boolean;
    attributeType: CategoryAttributeType;
}

 export interface IProductCategory {
    id: number;
    name: string;
    description: string;
    slug: string;
    parentCategoryId?: number;
    categoryAttributes: ICategoryAttribute[];
    children: IProductCategory[];
}

 export interface IProductMetaData {
    categories: IProductCategory[];
    productAttributes: IProductAttribute[];
}
