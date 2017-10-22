import * as React from "React";
import { connect } from "react-redux";
import { parse } from 'qs';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from "../../../store";
import * as ProductState from "../../../store/products";
import { Alert, Spin, Pagination } from "antd";
import { IProductListModel } from "../../../models/product-models";
import * as _ from 'lodash';
import { Link } from "react-router-dom";

import * as Api from "../../../api";

interface IProductComponentState {
    currentPage: number;
}

type ProductsProps =
    ProductState.IProductsState
    & typeof ProductState.actionCreator
    & RouteComponentProps<any>;
class ProductsComponent extends React.Component<ProductsProps, IProductComponentState> {

    private routeListener = null;

    constructor(props: ProductsProps) {
        super(props);
        this.state = {
            currentPage: 0
        };
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentWillMount(): void {

        this.routeListener = this.props.history.listen((listener) => {
            this.locationChange(listener.search);
        });

        this.locationChange(this.props.location.search);
    }

    componentWillUnmount(): void {

        this.routeListener = null;

    }

    private locationChange(search: string) {

        const query = parse(search.substr(1));

        let page = query.page ? Number(query.page) : 1;
        let pageSize = query.pageSize ? Number(query.pageSize) : 100;

        this.setState({
            currentPage: page
        });

        this.props.getProducts({
            page: page,
            pageSize: pageSize
        });
    }

    private showTotal(total: number): string {
        return `Total ${total} items`;
    }

    private onChangePage(pageNumber: number) {

        const query = parse(this.props.location.search.substr(1));
        let pageSize = query.pageSize ? Number(query.pageSize) : 100;
        this.props.navigateToProductsPage(pageNumber, pageSize);
    }

    public renderProducts() {

        let rows = _.map(this.props.productListData.productList.result,
            (product: IProductListModel) => {

                let imageUrl = Api.getImageAssets(product.images[0], 130, null);

                return <tr>
                    <td>
                        <div className="product-item"><a className="product-thumb"><img src={imageUrl} alt="Product" /></a>
                            <div className="product-info">
                                <h4 className="product-title"><a href="shop-single.html">{product.title}</a></h4>
                                <div className="text-lg text-medium text-muted">Rs. {product.price.toFixed(2)}</div>
                                <div>Availability: &nbsp;
                                    {product.quantity > 0 && <div className="d-inline text-success">In Stock</div>}
                                    {product.quantity === 0 && <div className="d-inline text-warning">No Stock</div>}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="text-center"><a className="remove-from-cart" href="#" data-toggle="tooltip" title="Remove item"><i className="icon-cross"></i></a></td>
                </tr>;
            });

        if (this.props.productListData.productList.result.length === 0) {
            return <div className="mt-2">
                <Alert description="You dont have any products." message="No Products" type="info" showIcon />
            </div>;
        }

        return <div>
            <table className="table margin-top-1x">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>

        </div>;
    }

    public renderPagination() {

        if (this.props.productListData && this.props.productListData.productList
            && this.props.productListData.productList.count > 0) {
            return <Pagination total={this.props.productListData.productList.count}
                current={this.state.currentPage}
                pageSize={this.props.productListData.productList.pageSize}
                showTotal={this.showTotal}
                onChange={this.onChangePage} />;
        }

    }

    public renderContent() {

        if (!this.props.productListData.loading && this.props.productListData.error) {
            return <div className="mt-3"><Alert
                message="Error"
                description={this.props.productListData.error}
                type="error"
                showIcon /></div>;
        }

        if (this.props.productListData.loading || !this.props.productListData.productList) {
            return <div className="margin-top-1x margin-bottom-1x text-center">
                <Spin size="large" />
            </div>;
        }

        return <div className="table-responsive wishlist-table margin-bottom-none">
            {this.renderProducts()}
        </div>;

    }

    public render() {
        return <div className="portal-product-list">
            <div className="row">
                <div className="col-md-8">
                    <h3 className="mt-1">Products</h3>
                    <p>Your current listing, if you need add new listing, press new product</p>
                    <Link className="btn btn-sm btn-secondary mt-sm-2" to="/portal/products/add-product">
                        <i className="icon-plus"></i>
                        &nbsp;New Product
                    </Link>
                </div>
                <div className="col-md-4"></div>
            </div>
            {this.renderContent()}
            {this.renderPagination()}
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator,
)(ProductsComponent) as typeof ProductsComponent;
