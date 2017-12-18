import * as React from "React";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { parse } from 'qs';

import { RouteComponentProps } from 'react-router-dom';

import { Button, Spin } from "antd";

import { ApplicationState } from "../../store";
import * as CatelogState from "../../store/catelog";
import * as ProductsState from "../../store/products";

import { IProductListModel, IProductAttribute, IProductAttributeValue } from '../../models/product-models';

import ProductFilters from './products-filter-component';
import { IAttributeItem, IProductFilterChangeEvent } from './products-filter-component';

import { animateScroll } from 'react-scroll';

import * as _ from 'lodash';

import * as Api from "../../api";

interface IProductsRouteProps {
    category: string;
}

interface IProductsState {
    vendors: string[];
    attributes: number[];
    maxPrice?: number,
    minPrice?: number,
    showScrollToTopButton: boolean,
}

type ProductsProps =
    CatelogState.ICatelogState
    & typeof CatelogState.actionCreator
    & ProductsState.IProductsState
    & typeof ProductsState.actionCreator
    & RouteComponentProps<IProductsRouteProps>
class Products extends React.Component<ProductsProps, IProductsState> {

    private routeListener = null;
    private pageSize: number = 8;

    constructor(props: ProductsProps) {
        super(props);

        const query = parse(this.props.history.location.search.substr(1));
        let vendors: string[] = !query.vendors ? [] : query.vendors.split(",");
        let attributes: number[] = !query.attributes ? [] :
            _.map(query.attributes.split(","), (attribute) => { return Number(attribute); });
        let maxPrice: number = !query.maxPrice ? null : Number(query.maxPrice);
        let minPrice: number = !query.minPrice ? null : Number(query.minPrice);

        this.state = {
            vendors: vendors,
            attributes: attributes,
            maxPrice: maxPrice,
            minPrice: minPrice,
            showScrollToTopButton: false
        }
        this.onFilterChange = this.onFilterChange.bind(this);
        this.loadItems = this.loadItems.bind(this);
        this.hasMore = this.hasMore.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount(): void {

        this.routeListener = this.props.history.listen((listener) => {
            const query = parse(listener.search.substr(1));
            this.changeRoute(query);
        });

        this.props.getMetaData();

        const query = parse(this.props.history.location.search.substr(1));
        this.changeRoute(query);

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', this.handleScroll);
        }
    }

    componentWillUnmount(): void {
        this.routeListener = null;
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }

    scrollToTop(): void {
        animateScroll.scrollToTop({
            duration: 500,
            delay: 100,
            smooth: true,
            offset: 50
        });
    }

    handleScroll(event) {
        let scrollTop = document.documentElement.scrollTop;
        if (scrollTop > 200) {
            this.setState({
                showScrollToTopButton: true
            });
        } else {
            this.setState({
                showScrollToTopButton: false
            });
        }

    }

    changeRoute(query) {

        let vendors: string[] = !query.vendors ? [] : query.vendors.split(",");
        let attributes: number[] = !query.attributes ? [] : _.map(query.attributes.split(","), (attribute) => { return Number(attribute); });
        let maxPrice: number = !query.maxPrice ? null : Number(query.maxPrice);
        let minPrice: number = !query.minPrice ? null : Number(query.minPrice);

        this.props.getCatelogProducts({
            category: this.props.match.params.category,
            priceMax: maxPrice,
            priceMin: minPrice,
            searchtext: null,
            attributeValues: attributes,
            vendors: vendors,
            page: 1,
            pageSize: this.pageSize
        });

        if (typeof window !== 'undefined') {
            this.scrollToTop();
        }

    }

    hasMore(): boolean {

        if (this.props.catelogProducts == null || this.props.catelogProducts.data == null) {
            return false;
        }

        return this.props.catelogProducts.data.products.currentPage < this.props.catelogProducts.data.products.pages;
    }

    loadItems() {
        this.props.loadMoreProducts();
    }

    onFilterChange(event: IProductFilterChangeEvent) {

        this.setState({
            vendors: event.vendors,
            attributes: event.attributes,
            maxPrice: event.maxPrice,
            minPrice: event.minPrice
        }, () => {
            this.props.navigationToCatelogPage(this.props.match.params.category, this.state.vendors,
                this.state.attributes, null, this.state.maxPrice, this.state.minPrice);
        });

    }

    public renderProducts() {

        if (this.props.catelogProducts == null || this.props.catelogProducts.data == null) {
            return null;
        }

        var productItems = _.map(this.props.catelogProducts.data.products.result,
            (product: IProductListModel) => {

                let imageUrl = Api.getImageAssets(product.images[0], 360, 480);

                return <div key={product.id} className="grid-item">
                    <div className="product-card">
                        <a className="product-thumb"><img src={imageUrl} alt="Product" /></a>
                        <h3 className="product-title"><a><b>{product.title}</b></a>
                        </h3>
                        <h4 className="product-price">Rs. {product.price}</h4>
                        <div className="product-buttons">
                            <Button shape="circle" icon="heart-o" /> &nbsp;
                            <Button>Add to Cart</Button>
                        </div>
                    </div>
                </div>;
            });

        return productItems;
    }

    public render() {

        if (this.props.catelogProducts.data == null || this.props.catelogProducts.data.meta == null) {
            return <div className="container padding-bottom-3x mb-1">
                <Spin size="large" />
            </div>;
        }

        const meta = this.props.catelogProducts.data.meta;
        const products = this.props.catelogProducts.data.products;

        const vendorsFilters = _.map(this.props.catelogProducts.data.meta.vendors,
            (name: string) => {
                let checked = _.includes(this.state.vendors, name);
                return {
                    id: 0,
                    name: name,
                    checked: checked
                }
            });

        const attributeFilters = _.map(this.props.meta.metaData.productAttributes,
            (attribute: IProductAttribute) => {

                let filterItems: IAttributeItem[] = [];

                _.map(this.props.catelogProducts.data.meta.attributeValues,
                    (attributeValue: number) => {
                        let value: IProductAttributeValue = _.find(attribute.productAttributeValues, { id: attributeValue });
                        let checked = _.includes(this.state.attributes, attributeValue);
                        if (value) {
                            filterItems.push({
                                id: value.id,
                                name: value.value,
                                meta: value.meta,
                                checked: checked
                            });
                        }
                    }
                );

                return {
                    id: attribute.id,
                    name: attribute.name,
                    filterItems: filterItems
                }
            });

        const maxPrice = this.props.catelogProducts.data.meta.priceMax;
        const minPrice = this.props.catelogProducts.data.meta.priceMin;

        const currentMaxPrice = this.state.maxPrice ? this.state.maxPrice : maxPrice;
        const currentMinPrice = this.state.minPrice ? this.state.minPrice : minPrice;

        return <div className="container padding-bottom-3x mb-1">
            <div className="row">
                <div className="col-xl-9 col-lg-8 push-xl-3 push-lg-4">
                    <div className="shop-toolbar padding-bottom-1x mb-2">
                        <div className="column">
                            <h5>{meta.categoryName}&nbsp;&nbsp;<small className="d-inline">{products.count} items</small></h5>
                        </div>
                        <div className="column">
                            <div className="shop-sorting">
                                <label>Sort by:</label>
                                <select className="form-control" id="sorting">
                                    <option>Popularity</option>
                                    <option>Low - High Price</option>
                                    <option>High - Low Price</option>
                                    <option>Avarage Rating</option>
                                    <option>A - Z Order</option>
                                    <option>Z - A Order</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="isotope-grid cols-4 mb-2">
                        <div className="gutter-sizer"></div>
                        <div className="grid-sizer"></div>
                        <Spin tip="Loading..." spinning={this.props.catelogProducts.loading} size={"large"}>
                            {this.renderProducts()}
                        </Spin>
                        {this.hasMore() && <div className="text-center"><Button type={"danger"} size={"large"} ghost onClick={this.loadItems} loading={this.props.catelogProducts.loadingMore}>Show more products...</Button></div>}
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 pull-xl-9 pull-lg-8">
                    <ProductFilters onChange={this.onFilterChange} vendors={vendorsFilters} attributeFilters={attributeFilters}
                        maxPrice={maxPrice} minPrice={minPrice} currentMinPrice={currentMinPrice} currentMaxPrice={currentMaxPrice} />
                </div>
            </div>
            { this.state.showScrollToTopButton && <div className="scroll-to-top-btn visible" onClick={this.scrollToTop}><i className="icon-arrow-up"></i></div>}
        </div>;
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    ...state.catelog, ...state.products
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    ...CatelogState.actionCreator,
    ...ProductsState.actionCreator,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Products);
