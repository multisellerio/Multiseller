export interface IProductAttributeValue {
    id: number;
    value: string;
    meta: any;
}

export interface IProductAttribute {
    id: number;
    name: string;
    description: string;
    meta: any;
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

export interface IProductImage {
    id: number;
    name: string;
}

export interface IProductVariantSpecificationAttributeMapping {
    id: number;
    productVariantId: number;
    productAttributeValues: number[];
}

export interface IProductVariant {
    id: number;
    price: number;
    compareAtPrice: number;
    quantity: number;
    sku: string;
    barcode: string;
    defaultImage: string;
    productVariantSpecificationAttributeMappings: IProductVariantSpecificationAttributeMapping[];
}

export interface IProductAttributeMapping {
    id: number;
    productAttributeId: number;
}

export interface IProduct {
    id: number;
    categoryId: number;
    title: string;
    description: string;
    vendor: string;
    images: IProductImage[];
    productVariants: IProductVariant[];
}

export interface IProductListModel {
    id: number;
    slug: string;
    categoryId: number;
    categoryName: string;
    title: string;
    description: string;
    vendor: string;
    images: string[];
    quantity: number;
    price: number;
}

export interface IProductListRequest {
    page: number;
    pageSize: number;
    force: boolean;
}

export interface IProductQuery {
    page: number;
    pageSize: number;
    searchtext: string;
    category: string;
    priceMin?: number;
    priceMax?: number;
    vendors: string[];
    attributeValues: number[];
}

export interface IProductList {
    count: number;
    currentPage: number;
    pageSize: number;
    pages: number;
    result: IProductListModel[];
}

export interface IProductSearchMeta {
    searchText: string;
    priceMin?: number;
    priceMax?: number;
    categoryId: number;
    categoryName: string;
    vendors: string[];
    attributeValues: number[];
}

export interface IProductSearchResult {
    products: IProductList;
    meta: IProductSearchMeta;
}



