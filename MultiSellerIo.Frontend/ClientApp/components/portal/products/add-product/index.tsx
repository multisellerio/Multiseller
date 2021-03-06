﻿import * as React from "React";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { ApplicationState } from "../../../../store";
import * as ProductState from "../../../../store/products";
import { Alert } from "antd";
import { ProductForm, IProductFormData, formName as ProductFormName } from '../product-form';
import * as _ from 'lodash';
import { currentyToNumeric } from '../../../../util/common/currency';

type AddProductProps =
    { products: ProductState.IProductsState, formValues: IProductFormData }
    & typeof ProductState.actionCreator;
class AddProductComponents extends React.Component<AddProductProps, {}> {

    constructor(props: AddProductProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    public componentWillMount(): void {
        this.props.getMetaData();
    }

    private onSubmit(productFormData: IProductFormData) {
        this.props.addProduct({
            id: 0,
            categoryId: productFormData.category[productFormData.category.length - 1],
            title: productFormData.title,
            description: productFormData.description,
            vendor: productFormData.vendor,
            images: _.map(productFormData.images, (image) => { return { id: image.id, name: image.name } }),
            productVariants: _.map(productFormData.productVariants, (variant) => {
                return {
                    id: variant.id,
                    sku: variant.sku,
                    compareAtPrice: 0,
                    barcode: null,
                    price: currentyToNumeric(variant.price),
                    quantity: variant.quantity,
                    defaultImage: null,
                    productVariantSpecificationAttributeMappings: _.map(variant.attributes, (attribute) => {
                        return {
                            id: 0,
                            productVariantId: attribute.attributeId,
                            productAttributeValues: attribute.values
                        }
                    })
                }
            }),
            productAttributeValues: []
        });
    }

    public render() {
        return <div>
            <div className="row">
                <div className="col-md-8">
                    <h3 className="mt-1">Add Product</h3>
                    <p>Enter your product details with product variants</p>
                </div>
                <div className="col-md-4"></div>
            </div>
            {this.props.products.currentProductData.error && <div><Alert
                message="Error"
                description={this.props.products.currentProductData.error}
                type="error"
                showIcon
            /><br /></div>}
            {!this.props.products.currentProductData.error && <ProductForm formValues={this.props.formValues} loading={this.props.products.currentProductData.loading} metaData={this.props.products.meta.metaData} onSubmit={this.onSubmit} editing={false} />}
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => {
        let formValues = getFormValues(ProductFormName)(state) || {};
        return {
            products: state.products,
            formValues: formValues
        }
    },
    ProductState.actionCreator,
)(AddProductComponents) as typeof AddProductComponents;
