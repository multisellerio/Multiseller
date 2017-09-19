import * as React from 'React';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { reduxForm, Field, FormProps, FormErrors } from 'redux-form';

export default class ProductsComponent extends React.Component<{}, {}> {

    public render() {
        return <div>
            <div className="table-responsive wishlist-table margin-bottom-none">
                <Link className="btn btn-sm btn-outline-primary" to='/portal/products/add-product'>
                    <i className="icon-plus"></i>
                    &nbsp;New Product
                </Link>
                <table className="table margin-top-1x">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th className="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="product-item"><a className="product-thumb" href="shop-single.html"><img src="/img/shop/cart/01.jpg" alt="Product" /></a>
                                    <div className="product-info">
                                        <h4 className="product-title"><a href="shop-single.html">Unionbay Park</a></h4>
                                        <div className="text-lg text-medium text-muted">$43.90</div>
                                        <div>Availability:
                                               <div className="d-inline text-success">In Stock</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center"><a className="remove-from-cart" href="#" data-toggle="tooltip" title="Remove item"><i className="icon-cross"></i></a></td>
                        </tr>
                        <tr>
                            <td>
                                <div className="product-item"><a className="product-thumb" href="shop-single.html"><img src="/img/shop/cart/02.jpg" alt="Product" /></a>
                                    <div className="product-info">
                                        <h4 className="product-title"><a href="shop-single.html">Daily Fabric Cap</a></h4>
                                        <div className="text-lg text-medium text-muted">$24.70</div>
                                        <div>Availability:
                                               <div className="d-inline text-warning">2 - 3 Weeks</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center"><a className="remove-from-cart" href="#" data-toggle="tooltip" title="Remove item"><i className="icon-cross"></i></a></td>
                        </tr>
                        <tr>
                            <td>
                                <div className="product-item"><a className="product-thumb" href="shop-single.html"><img src="/img/shop/cart/03.jpg" alt="Product" /></a>
                                    <div className="product-info">
                                        <h4 className="product-title"><a href="shop-single.html">Cole Haan Crossbody</a></h4>
                                        <div className="text-lg text-medium text-muted">$200.00</div>
                                        <div>Availability:
                                               <div className="d-inline text-success">In Stock</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center"><a className="remove-from-cart" href="#" data-toggle="tooltip" title="Remove item"><i className="icon-cross"></i></a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>;
    }
}