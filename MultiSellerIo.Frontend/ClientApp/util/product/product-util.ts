import { IProductFormData, IProductImage, IProductVairation, IProductVariationAttribute } from "../../components/portal/products/product-form";
import { IProduct, IProductVariant, IProductCategory, IProductVariantSpecificationAttributeMapping } from "../../models/product-models";
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
        let category = _.find(allCategories, { id: categoryId });

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

    }

}

export default productUtil;