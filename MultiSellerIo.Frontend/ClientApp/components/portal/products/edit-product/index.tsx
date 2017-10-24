import * as React from "React";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ApplicationState } from "../../../../store";
import * as ProductState from "../../../../store/products";
import { Alert } from "antd";
import { ProductForm, IProductFormData } from '../product-form';
import * as _ from 'lodash';

interface IEditParameters {
    id: number;
}

interface IEditProductState {

}

type EditProductProps =
    ProductState.IProductsState
    & typeof ProductState.actionCreator & RouteComponentProps<IEditParameters>;
class EditProductComponent extends React.Component<EditProductProps, IEditProductState> {

    constructor(props: EditProductProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    public componentWillMount(): void {
        let productId = Number(this.props.match.params.id);
        this.props.getProduct(productId);
    }

    private onSubmit(productFormData: IProductFormData) {
        console.log(productFormData);
        this.props.updateProduct({
            id: productFormData.id,
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
            <div className="row">
                <div className="col-md-8">
                    <h3 className="mt-1">Edit Product</h3>
                    <p>Enter your product details with product variants</p>
                </div>
                <div className="col-md-4"></div>
            </div>
            {this.props.currentProductData.error && <div><Alert
                message="Error"
                description={this.props.currentProductData.error}
                type="error"
                showIcon
            /><br /></div>}
            <ProductForm loading={this.props.currentProductData.loading} metaData={this.props.meta.metaData} onSubmit={this.onSubmit} editing={true} initialValues={this.props.currentProductData.product} />
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator,
)(EditProductComponent) as typeof EditProductComponent;
