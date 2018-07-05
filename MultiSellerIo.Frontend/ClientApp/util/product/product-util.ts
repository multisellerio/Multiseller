import { IProductFormData, IProductImage, IProductVairation, IProductVariationAttribute, IProductAttribute as FormProductAttribute } from "../../components/portal/products/product-form";
import {
    IProduct, IProductVariant, IProductCategory, IProductVariantSpecificationAttributeMapping,
    IProductAttribute, IProductAttributeValue, IProductMetaData, IProductDetailsAttribute,
    ICategoryAttribute, IProductDetailsAttributeValue, CategoryAttributeType
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

    toProductFormData(metaData: IProductMetaData, product: IProduct): IProductFormData {

        let images: IProductImage[] = _.map(product.images,
            (image) => {

                return {
                    id: image.id,
                    name: image.name
                }

            });

        let category = this.getCategory(product.categoryId, metaData.categories);

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

        let productCategory = this.getCategoryById(product.categoryId, metaData);

        let attributes = _.map(_.filter(productCategory.categoryAttributes, (categoryAttribute: ICategoryAttribute) => {
            return categoryAttribute.attributeType === CategoryAttributeType.Simple;
        }), (categoryAttribute: ICategoryAttribute) => {

            var allProductAttributeValues: number[] = _.map(categoryAttribute.productAttribute.productAttributeValues,
                (productAttributeValue) => {
                    return productAttributeValue.id;
                });

            var attributeValues = _.intersection(allProductAttributeValues, product.productAttributeValues);

            return {
                id: categoryAttribute.productAttribute.id,
                name: categoryAttribute.productAttribute.name,
                value: attributeValues
            }

        });

        return {
            id: product.id,
            title: product.title,
            category: category,
            description: product.description,
            vendor: product.vendor,
            images: images,
            productVariants: productVariants,
            attributes: attributes
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

    getProductVariantInProductByAttributes(product: IProduct, attributes: number[]): IProductVariant {
        return _.find(product.productVariants,
            (productVariant) => {
                return productUtil.containAttributeValuesInProductVariant(productVariant, attributes);
            });
    },

    getAllVariations(metaData: IProductMetaData, product: IProduct, selectedValues: number[]): IProductDetailsAttribute[] {
        let productAttributes: IProductDetailsAttribute[] = [];

        //Todo handle the grouped product attributes (not need for now, the groupd attribute is not using in initial stage)        
        _.each(product.productVariants,
            (productVariant: IProductVariant) => {

                _.each(productVariant.productVariantSpecificationAttributeMappings,
                    (attributeMapping:
                        IProductVariantSpecificationAttributeMapping) => {

                        let productAttribute: IProductAttribute = this.getProductAttributeByAttributeValue(metaData, attributeMapping.productAttributeValues[0]);

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
                            productAttributes.push({
                                productAttribute: productAttribute,
                                values: [
                                    {
                                        values: [productAttributeValue]
                                    }]
                            });
                        }

                    });
            });

        return productAttributes;
    },

    containAttributeValuesInProductVariant(productVarient: IProductVariant, attributeValues: number[]): boolean {
        let productVariantAttributeValues = _.map(productVarient.productVariantSpecificationAttributeMappings,
            (productVariantSpecificationAttributeMappings) => {
                return productVariantSpecificationAttributeMappings.productAttributeValues[0];
            });
        return _.difference(productVariantAttributeValues, attributeValues).length === 0;
    },
}

export default productUtil;