import * as React from 'react';

export default class MegaMenu extends React.Component<{}, {}> {

    public render() {
        return <li className="has-megamenu"><a href="#"><span>Mega Menu</span></a>
            <ul className="mega-menu">
                <li><span className="mega-menu-title">Top Categories</span>
                    <ul className="sub-menu">
                        <li><a href="#">Men's Shoes</a></li>
                        <li><a href="#">Women's Shoes</a></li>
                        <li><a href="#">Shirts and Tops</a></li>
                        <li><a href="#">Swimwear</a></li>
                        <li><a href="#">Shorts and Pants</a></li>
                        <li><a href="#">Accessories</a></li>
                    </ul>
                </li>
                <li><span className="mega-menu-title">Specialty Shops</span>
                    <ul className="sub-menu">
                        <li><a href="#">Junior's Shop</a></li>
                        <li><a href="#">Swim Shop</a></li>
                        <li><a href="#">Athletic Shop</a></li>
                        <li><a href="#">Outdoor Shop</a></li>
                        <li><a href="#">Luxury Shop</a></li>
                        <li><a href="#">Accessories Shop</a></li>
                    </ul>
                </li>
                <li>
                    <section className="promo-box"><span className="overlay-dark"></span>
                        <div className="promo-box-content text-center padding-top-2x padding-bottom-2x">
                            <h4 className="text-light text-thin text-shadow">New Collection of</h4>
                            <h3 className="text-bold text-light text-shadow">Sunglasses</h3><a className="btn btn-sm btn-primary" href="#">Shop Now</a>
                        </div>
                    </section>
                </li>
                <li>
                    <section className="promo-box">
                        <div className="promo-box-content text-center padding-top-2x padding-bottom-2x">
                            <h3 className="text-bold text-light text-shadow">Limited Offer</h3>
                            <h4 className="text-light text-thin text-shadow">save up to 50%!</h4><a className="btn btn-sm btn-primary" href="#">Learn More</a>
                        </div>
                    </section>
                </li>
            </ul>
        </li>;
    }

}