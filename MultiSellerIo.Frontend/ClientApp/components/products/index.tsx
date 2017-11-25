import * as React from "React";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { parse } from 'qs';

import { RouteComponentProps } from 'react-router-dom';

import { Button, Pagination, Spin } from "antd";

import { ApplicationState } from "../../store";
import * as CatelogState from "../../store/catelog";
import * as ProductsState from "../../store/products";

import { IProductListModel, IProductAttribute, IProductAttributeValue } from '../../models/product-models';

import ProductFilters from './products-filter-component';
import { IAttributeItem, IProductFilterChangeEvent } from './products-filter-component';

import * as _ from 'lodash';

import * as Api from "../../api";

interface IProductsRouteProps {
    category: string;
}

interface IProductsState {
    vendors: string[];
    attributes: number[];
}

type ProductsProps =
    CatelogState.ICatelogState
    & typeof CatelogState.actionCreator
    & ProductsState.IProductsState
    & typeof ProductsState.actionCreator
    & RouteComponentProps<IProductsRouteProps>
class Products extends React.Component<ProductsProps, IProductsState> {

    private routeListener = null;

    constructor(props: ProductsProps) {
        super(props);

        const query = parse(this.props.history.location.search.substr(1));
        let vendors: string[] = !query.vendors ? [] : query.vendors.split(",");
        let attributes: number[] = !query.attributes ? [] :
            _.map(query.attributes.split(","), (attribute) => { return Number(attribute); });

        console.log(vendors);
        console.log(attributes);

        this.state = {
            vendors: vendors,
            attributes: attributes
        }
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    componentWillMount(): void {

        this.routeListener = this.props.history.listen((listener) => {
            const query = parse(listener.search.substr(1));
            this.changeRoute(query);
        });

        this.props.getMetaData();

        const query = parse(this.props.history.location.search.substr(1));
        this.changeRoute(query);

    }

    componentWillUnmount(): void {
        this.routeListener = null;
    }

    changeRoute(query) {

        let vendors: string[] = !query.vendors ? [] : query.vendors.split(",");
        let attributes: number[] = !query.attributes ? [] : _.map(query.attributes.split(","), (attribute) => { return Number(attribute); });

        this.props.getCatelogProducts({
            page: 1,
            pageSize: 100,
            category: this.props.match.params.category,
            priceMax: null,
            priceMin: null,
            searchtext: null,
            attributeValues: attributes,
            vendors: vendors
        });

    }

    onFilterChange(event: IProductFilterChangeEvent) {

        this.setState({
            vendors: event.vendors,
            attributes: event.attributes
        }, () => {
            this.props.navigationToCatelogPage(this.props.match.params.category, 1, 100, this.state.vendors,
                this.state.attributes, null, null, null);
        });

    }

    public renderProducts() {

        if (this.props.catelogProducts.loading) {
            return <Spin size="large" />;
        }

        if (this.props.catelogProducts == null || this.props.catelogProducts.data == null) {
            return null;
        }

        var productItems = _.map(this.props.catelogProducts.data.products.result,
            (product: IProductListModel) => {

                let imageUrl = Api.getImageAssets(product.images[0], 360, 480);

                return <div className="grid-item">
                    <div className="product-card">
                        <a className="product-thumb"><img src={imageUrl} alt="Product" /></a>
                        <h3 className="product-title"><a>{product.title}</a>
                        </h3>
                        <h4 className="product-price"><del>$99.99</del>{product.price}</h4>
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
                        {this.renderProducts()}
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 pull-xl-9 pull-lg-8">
                    <ProductFilters onChange={this.onFilterChange} vendors={vendorsFilters} attributeFilters={attributeFilters} />
                </div>
            </div>
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
