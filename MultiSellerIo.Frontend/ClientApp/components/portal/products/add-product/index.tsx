﻿import * as React from "React";
import { connect } from "react-redux";
import { ApplicationState } from "../../../../store";
import * as ProductState from "../../../../store/products";
import { Alert } from "antd";
import { ProductForm, IProductFormData } from '../product-form';
import * as _ from 'lodash';

type AddProductProps =
    ProductState.IProductsState
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
                    //Todo this currency is coming to backend
                    price: variant.price.replace("Rs. ", "").replace(",", ""),
                    quantity: variant.quantity,
                    defaultImage: variant.defaultImage,
                    productVariantSpecificationAttributeMappings: _.map(variant.attributes, (attribute) => {
                        return {
                            id: 0,
                            productVariantId: attribute.attributeId,
                            productAttributeValues: attribute.values
                        }
                    })
                }
            })
        });
    }

    public render() {
        return <div>
            <h3 className="padding-bottom-1x">Add Product</h3>
            {this.props.currentProductData.error && <div><Alert
                message="Error"
                description={this.props.currentProductData.error}
                type="error"
                showIcon
            /><br/></div>}
            <ProductForm metaData={this.props.meta.metaData} onSubmit={this.onSubmit} />
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator,
)(AddProductComponents) as typeof AddProductComponents;
