import * as React from "React";
import { connect } from "react-redux";
import * as ProductState from "../../../../store/products";
import { ProductForm } from '../product-form';

type AddProductProps =
    ProductState.IProductsState
    & typeof ProductState.actionCreator;
class AddProductComponents extends React.Component<AddProductProps, {}> {

    public componentWillMount(): void {
        this.props.getMetaData();
    }

    private onSubmit(product: any) {
        console.log(product);
    }

    public render() {
        return <div>
            <h3 className="padding-bottom-1x">Add Product</h3>
            <ProductForm metaData={this.props.metaData} onSubmit={this.onSubmit} />
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator,
)(AddProductComponents) as typeof AddProductComponents;
