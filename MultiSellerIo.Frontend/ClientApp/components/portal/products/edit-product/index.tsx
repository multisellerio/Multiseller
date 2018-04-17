import * as React from "React";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { RouteComponentProps } from "react-router-dom";
import { ApplicationState } from "../../../../store";
import * as ProductState from "../../../../store/products";
import { Alert, Spin } from "antd";
import { ProductForm, IProductFormData, formName as ProductFormName } from '../product-form';
import * as _ from 'lodash';
import { currentyToNumeric } from '../../../../util/common/currency';

interface IEditParameters {
    id: number;
}

interface IEditProductState {

}

type EditProductProps =
    { products: ProductState.IProductsState, formValues: IProductFormData }
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
            {this.props.products.currentProductData.error && <div><Alert
                message="Error"
                description={this.props.products.currentProductData.error}
                type="error"
                showIcon
            /><br /></div>}
            <div className="text-center">
                {this.props.products.currentProductData.dataLoading && <Spin size="large" spinning={this.props.products.currentProductData.dataLoading} />}
            </div>
            {!this.props.products.currentProductData.dataLoading && !this.props.products.currentProductData.error && <ProductForm loading={this.props.products.currentProductData.loading} formValues={this.props.formValues}  metaData={this.props.products.meta.metaData} onSubmit={this.onSubmit} editing={true} initialValues={this.props.products.currentProductData.product} />}
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
)(EditProductComponent) as typeof EditProductComponent;
