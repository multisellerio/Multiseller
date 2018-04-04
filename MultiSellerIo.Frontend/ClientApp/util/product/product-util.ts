import { IProductFormData, IProductImage, IProductVairation, IProductVariationAttribute } from "../../components/portal/products/product-form";
import {
    IProduct, IProductVariant, IProductCategory, IProductVariantSpecificationAttributeMapping,
    IProductAttribute, IProductAttributeValue, IProductMetaData, IProductDetailsAttribute,
    ICategoryAttribute, IProductDetailsAttributeValue
} from "../../models/product-models";
import * as _ from "lodash";
import { numberToCurrency } from '../common/currency';

const productUtil = {

    getChildCategoryItems(category: IProductCategory): IProductCategory[] {

        const self = this;

        if (!category.children || category.children.length === 0) {
            return [];
        }

        let productCategories = [];

        _.map(category.children,
            (child) => {
                productCategories = productCategories.concat([child, ...self.getChildCategoryItems(child)]);
            });

        return productCategories;
    },

    getAllCategories(categories: IProductCategory[]): IProductCategory[] {

        let allCategories: IProductCategory[] = [];

        _.map(categories,
            (category: IProductCategory) => {
                allCategories = allCategories.concat([category, ...this.getChildCategoryItems(category)]);
            });

        return allCategories;
    },

    getCategory(categoryId: number, categories: IProductCategory[]): number[] {

        let allCategories = this.getAllCategories(categories);
        let category: IProductCategory = _.find(allCategories, { id: categoryId });

        if (category == null) {
            return [];
        }

        let categoriesIds = [];

        let parentCategory = category;

        do {

            if (parentCategory) {
                categoriesIds.push(parentCategory.id);
            }

            if (!parentCategory || parentCategory.parentCategoryId == null) {
                break;
            }

            parentCategory = _.find(allCategories, { id: parentCategory.parentCategoryId });

        } while (true);

        return categoriesIds.reverse();

    },

    getCategoryById(categoryId: number, metaData: IProductMetaData): IProductCategory {
        let allCategories = this.getAllCategories(metaData.categories);
        let category: IProductCategory = _.find(allCategories, { id: categoryId });
        return category;
    },

    toProductFormData(product: IProduct, categories: IProductCategory[]): IProductFormData {

        let images: IProductImage[] = _.map(product.images,
            (image) => {

                return {
                    id: image.id,
                    name: image.name
                }

            });

        let category = this.getCategory(product.categoryId, categories);

        let productVariants: IProductVairation[] = _.map(product.productVariants,
            (productVariant: IProductVariant) => {

                let attributes: IProductVariationAttribute[] = _.map(
                    productVariant.productVariantSpecificationAttributeMappings,
                    (
                        (attribute: IProductVariantSpecificationAttributeMapping) => {
                            return {
                                name: '',
                                isGroup: false,
                                attributeId: attribute.productVariantId,
                                values: attribute.productAttributeValues
                            };
                        }));

                return {
                    id: productVariant.id,
                    sku: productVariant.sku,
                    upc: null,
                    quantity: productVariant.quantity,
                    price: numberToCurrency(productVariant.price),
                    defaultImage: productVariant.defaultImage,
                    attributes: attributes
                }

            });

        return {
            id: product.id,
            title: product.title,
            category: category,
            description: product.description,
            vendor: product.vendor,
            images: images,
            productVariants: productVariants
        }

    },

    getProductAttribute(meteData: IProductMetaData, id: number): IProductAttribute {
        if (meteData == null) {
            return null;
        }
        return _.find(meteData.productAttributes, { id: id });
    },

    getProductAttributeByAttributeValue(metaData: IProductMetaData, attributeValueId: number): IProductAttribute {
        if (metaData == null) {
            return null;
        }
        return _.find(metaData.productAttributes, (productAttribute: IProductAttribute) => {
            var attributeValue = _.find(productAttribute.productAttributeValues, { id: attributeValueId });
            return attributeValue != null;
        });
    },

    getAttributes(metaData: IProductMetaData, categoryId: number): ICategoryAttribute[] {

        const allCategories: IProductCategory[] = this.getAllCategories(metaData.categories);
        const category = _.find(allCategories, { id: categoryId });

        if (!category) {
            return [];
        }

        let attributes: ICategoryAttribute[] = [];

        let parentCategory: IProductCategory = category;

        do {
            _.map(parentCategory.categoryAttributes,
                (attribute: ICategoryAttribute) => {
                    attributes = [...attributes, attribute];
                });

            if (parentCategory.parentCategoryId == null) {
                break;
            }

            parentCategory = _.find(allCategories, { id: parentCategory.parentCategoryId });

        } while (true);

        return attributes;
    },

    getAllVariations(metaData: IProductMetaData, product: IProduct): IProductDetailsAttribute[] {
        let productAttributes: IProductDetailsAttribute[] = [];
        let categoryAttributes: ICategoryAttribute[] = this.getAttributes(metaData, product.categoryId);

        _.each(product.productVariants,
            (productVariant: IProductVariant) => {

                _.each(productVariant.productVariantSpecificationAttributeMappings,
                    (attributeMapping:
                        IProductVariantSpecificationAttributeMapping) => {

                        let productAttribute: IProductAttribute = this.getProductAttributeByAttributeValue(metaData, attributeMapping.productAttributeValues[0]);
                        let categoryAttribute = _.find(categoryAttributes,
                            (ca) => {
                                return ca.productAttribute.id === productAttribute.id;
                            });

                        let currentProductAttribute: IProductDetailsAttribute = _.find(productAttributes,
                            (pa) => {
                                return pa.productAttribute.id === productAttribute.id;
                            });

                        let existsValueInNotGroupedAttribute = (productDetailsAttributeValues: IProductDetailsAttributeValue[], attributeValue: number): boolean => {
                            return _.find(productDetailsAttributeValues,
                                (productDetailsAttributeValue: IProductDetailsAttributeValue) => {
                                    let productAttributeValues = productDetailsAttributeValue.values;
                                    return _.find(productAttributeValues,
                                        (productAttributeValue: IProductAttributeValue) => productAttributeValue.id === attributeValue);
                                }) != null;
                        }

                        if (currentProductAttribute &&
                            !existsValueInNotGroupedAttribute(currentProductAttribute.values, attributeMapping.productAttributeValues[0])) {

                            //If value is not in current product attribute, add that value only
                            let productAttributeValue = _.find(productAttribute.productAttributeValues,
                                { id: attributeMapping.productAttributeValues[0] });
                            currentProductAttribute.values.push({
                                values: [productAttributeValue]
                            });

                        } else if (!currentProductAttribute) {

                            //If attribute not exists in product details attribute collection
                            let productAttributeValue = _.find(productAttribute.productAttributeValues,
                                { id: attributeMapping.productAttributeValues[0] });
                            //productAttributes.push({
                            //    productAttribute: productAttribute,
                            //    values: [
                            //        {
                            //            values: [productAttributeValue]
                            //        }]
                            //});
                        }

                    });
            });

        return productAttributes;
    },
}

export default productUtil;