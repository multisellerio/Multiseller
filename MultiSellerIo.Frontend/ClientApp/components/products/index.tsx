import * as React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FormErrors, InjectedFormProps, reduxForm } from "redux-form";

import { Slider, Button, Checkbox } from "antd";

import { ApplicationState } from "../../store";
import * as AccountState from "../../store/account";

import { InputComponent, Field } from "../shared/util/form-components";

import { CirclePicker } from "react-color";

type ProductsProps =
    AccountState.IAccountState
    & typeof AccountState.actionCreator;

class Products extends React.Component<ProductsProps, {}> {

    constructor(props: ProductsProps) {
        super(props);
    }

    componentWillMount(): void {

    }

    public render() {
        return <div className="container padding-bottom-3x mb-1">
            <div className="row">
                <div className="col-xl-9 col-lg-8 push-xl-3 push-lg-4">
                    <h3>Main T-Shirt&nbsp;&nbsp;<small className="d-inline">315000 items</small></h3>
                    <div className="shop-toolbar padding-bottom-1x mb-2">
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
                                </select><span className="text-muted">Showing:&nbsp;</span><span>1 - 12 items</span>
                            </div>
                        </div>
                        <div className="column">
                            <div className="shop-view"><a className="grid-view active" href="shop-grid-ls.html"><span></span><span></span><span></span></a><a className="list-view" href="shop-list-ls.html"><span></span><span></span><span></span></a></div>
                        </div>
                    </div>
                    <div className="isotope-grid cols-3 mb-2">
                        <div className="gutter-sizer"></div>
                        <div className="grid-sizer"></div>
                        <div className="grid-item">
                            <div className="product-card">
                                <div className="product-badge text-danger">50% Off</div><a className="product-thumb" href="shop-single.html"><img src="img/shop/products/01.jpg" alt="Product" /></a>
                                <h3 className="product-title"><a href="shop-single.html">Unionbay Park</a></h3>
                                <h4 className="product-price"><del>$99.99</del>$49.99</h4>
                                <div className="product-buttons">
                                    <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                                    <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="product-card">
                                <div className="product-badge text-danger">50% Off</div><a className="product-thumb" href="shop-single.html"><img src="img/shop/products/01.jpg" alt="Product" /></a>
                                <h3 className="product-title"><a href="shop-single.html">Unionbay Park</a></h3>
                                <h4 className="product-price"><del>$99.99</del>$49.99</h4>
                                <div className="product-buttons">
                                    <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                                    <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="product-card">
                                <div className="product-badge text-danger">50% Off</div><a className="product-thumb" href="shop-single.html"><img src="img/shop/products/01.jpg" alt="Product" /></a>
                                <h3 className="product-title"><a href="shop-single.html">Unionbay Park</a></h3>
                                <h4 className="product-price"><del>$99.99</del>$49.99</h4>
                                <div className="product-buttons">
                                    <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                                    <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="product-card">
                                <div className="product-badge text-danger">50% Off</div><a className="product-thumb" href="shop-single.html"><img src="img/shop/products/01.jpg" alt="Product" /></a>
                                <h3 className="product-title"><a href="shop-single.html">Unionbay Park</a></h3>
                                <h4 className="product-price"><del>$99.99</del>$49.99</h4>
                                <div className="product-buttons">
                                    <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                                    <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="product-card">
                                <div className="product-badge text-danger">50% Off</div><a className="product-thumb" href="shop-single.html"><img src="img/shop/products/01.jpg" alt="Product" /></a>
                                <h3 className="product-title"><a href="shop-single.html">Unionbay Park</a></h3>
                                <h4 className="product-price"><del>$99.99</del>$49.99</h4>
                                <div className="product-buttons">
                                    <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                                    <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="product-card">
                                <div className="product-badge text-danger">50% Off</div><a className="product-thumb" href="shop-single.html"><img src="img/shop/products/01.jpg" alt="Product" /></a>
                                <h3 className="product-title"><a href="shop-single.html">Unionbay Park</a></h3>
                                <h4 className="product-price"><del>$99.99</del>$49.99</h4>
                                <div className="product-buttons">
                                    <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                                    <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="pagination">
                        <div className="column">
                            <ul className="pages">
                                <li className="active"><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>
                                <li>...</li>
                                <li><a href="#">12</a></li>
                            </ul>
                        </div>
                        <div className="column text-right hidden-xs-down"><a className="btn btn-outline-secondary btn-sm" href="#">Next&nbsp;<i className="icon-arrow-right"></i></a></div>
                    </nav>
                </div>
                <div className="col-xl-3 col-lg-4 pull-xl-9 pull-lg-8">
                    <aside className="sidebar">
                        <section className="widget widget-categories">
                            <h3 className="widget-title">Price Range</h3>
                            <div className="price-range-slider">
                                <div>
                                    <Slider range defaultValue={[20, 50]} />
                                </div>
                                <div className="ui-range-slider-footer">
                                    <div className="column">
                                        <Button type="primary">Filter</Button>
                                    </div>
                                    <div className="column">
                                        <div className="ui-range-values">
                                            <div className="ui-range-value-min">$50<span></span>
                                            </div>&nbsp;-&nbsp;
                                        <div className="ui-range-value-max">$200<span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="widget">
                            <h3 className="widget-title">Filter by Colors</h3>
                            <CirclePicker/>
                        </section>
                        <section className="widget">
                            <h3 className="widget-title">Filter by Brand</h3>
                            <div className="d-block">
                                <Checkbox><b>Adidas</b> (254)</Checkbox>
                            </div>
                            <div className="d-block">
                                <Checkbox><b>Nike</b> (132)</Checkbox>
                            </div>
                            <div className="d-block">
                                <Checkbox><b>Under Armour</b> (32)</Checkbox>
                            </div>
                            <div className="d-block">
                                <Checkbox><b>Puma</b> (33)</Checkbox>
                            </div>
                        </section>
                        <section className="widget">
                            <h3 className="widget-title">Filter by Size</h3>
                            <div className="d-block">
                                <Checkbox><b>XL</b> (254)</Checkbox>
                            </div>
                            <div className="d-block">
                                <Checkbox><b>L</b> (132)</Checkbox>
                            </div>
                            <div className="d-block">
                                <Checkbox><b>M</b> (32)</Checkbox>
                            </div>
                            <div className="d-block">
                                <Checkbox><b>S</b> (33)</Checkbox>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    }

}



export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
)(Products);
