import * as React from "React";
import { connect } from "react-redux";
import { parse } from 'qs';
import {  UnregisterCallback } from 'history';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ApplicationState } from "../../../store";
import * as ProductState from "../../../store/products";
import { Alert, Spin, Pagination, Popconfirm, Input, Icon } from "antd";
import { IProductListModel } from "../../../models/product-models";
import * as _ from 'lodash';
import { numberToCurrency } from '../../../util/common/currency';

import { animateScroll } from 'react-scroll';

import * as Api from "../../../api";

const Search = Input.Search;

interface IProductComponentState {
    currentPage: number;
    searchText: string;
}

type ProductsProps =
    ProductState.IProductsState
    & typeof ProductState.actionCreator
    & RouteComponentProps<any>;
class ProductsComponent extends React.Component<ProductsProps, IProductComponentState> {

    private routeListener: UnregisterCallback = null;

    constructor(props: ProductsProps) {
        super(props);
        this.state = {
            currentPage: 0,
            searchText: ''
        };
        this.onChangePage = this.onChangePage.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchTextValueChange = this.onSearchTextValueChange.bind(this);
    }

    componentWillMount(): void {

        this.routeListener = this.props.history.listen((listener) => {
            this.locationChange(listener.search);
        });

        this.locationChange(this.props.location.search);
    }

    componentWillUnmount(): void {
        this.routeListener();
    }

    private locationChange(search: string) {

        this.scrollToTop();

        const query = parse(search.substr(1));

        let page = query.page ? Number(query.page) : 1;
        let pageSize = query.pageSize ? Number(query.pageSize) : 10;
        let searchText = query.search ? query.search : '';

        this.setState({
            currentPage: page,
            searchText: searchText
        });

        this.props.getProducts({
            page: page,
            pageSize: pageSize,
            force: false,
            searchText: searchText
        });

    }

    scrollToTop(): void {
        if (window) {
            animateScroll.scrollToTop({
                duration: 500,
                delay: 0,
                smooth: true,
                offset: 50
            });
        }
    }

    private showTotal(total: number): string {
        return `Total ${total} items`;
    }

    private onChangePage(pageNumber: number) {

        const query = parse(this.props.location.search.substr(1));
        let pageSize = query.pageSize ? Number(query.pageSize) : 10;
        let searchText = query.search ? query.search : '';

        this.props.navigateToProductsPage(searchText, pageNumber, pageSize);
    }

    private onSearch(searchText: string) {
        const query = parse(this.props.location.search.substr(1));
        let pageSize = query.pageSize ? Number(query.pageSize) : 10;
        this.props.navigateToProductsPage(searchText, 1, pageSize);
    }

    private onSearchTextValueChange(text: string) {
        this.setState({
            searchText: text
        });
    }

    public renderProducts() {

        let rows = _.map(this.props.productListData.productList.result,
            (product: IProductListModel) => {

                let imageUrl = Api.getImageAssets(product.images[0], 300, 300);

                return <tr key={product.id}>
                    <td>
                        <div className="product-item"><Link className="product-thumb" to={`/portal/selling/products/edit-product/${product.id}`}><img src={imageUrl} alt="Product" /></Link>
                            <div className="product-info">
                                <h6 className="product-title"><Link to={`/portal/selling/products/edit-product/${product.id}`}>{product.title}</Link></h6>
                                <div className="text-lg text-medium text-muted">{numberToCurrency(product.price)}</div>
                                <div>Availability: &nbsp;
                                    {product.quantity > 0 && <div className="d-inline text-success">In Stock</div>}
                                    {product.quantity === 0 && <div className="d-inline text-warning">No Stock</div>}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="text-center">
                        <Popconfirm title="Are you sure delete this product?" onConfirm={() => { this.props.deleteProduct(product.id) }} okText="Yes" cancelText="No">
                            <a className="remove-from-cart" data-toggle="tooltip" title="Remove item"><i className="icon-cross"></i></a>
                        </Popconfirm>
                    </td>
                </tr>;
            });

        if (this.props.productListData.productList.result.length === 0) {
            return <div className="mt-4">
                <Alert description="You dont have any products." message="No Products" type="info" showIcon />
            </div>;
        }

        return <div>
            <table className="table margin-top-1x">
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

    public renderSearchSection() {
        return <div className="row">
            <div className="col-md-12">
                <Search
                    placeholder="Enter keyword for search products"
                    value={this.state.searchText}
                    onSearch={value => this.onSearch(value)}
                    onChange={e => this.onSearchTextValueChange(e.target.value)}
                    enterButton
                />
            </div>
        </div>;
    }

    public render() {
        return <div className="portal-product-list">
            <div className="row">
                <div className="col-md-12">
                    <h3 className="mt-1">Products</h3>
                    <p>Your current listing, if you need add new listing, press new product</p>
                </div>
            </div>
            <div className="row margin-bottom-1x">
                <div className="col-md-12">
                    <div>
                        <Link className="text-decoration-none ant-btn ant-btn-primary" to="/portal/selling/products/add-product">
                            <Icon type="plus-circle" />&nbsp;
                            Add Product
                            </Link>
                    </div>
                </div>
            </div>
            {this.renderSearchSection()}
            {this.renderContent()}
            {this.renderPagination()}
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator,
)(ProductsComponent) as typeof ProductsComponent;
