import * as React from 'react';
import MegaMenu from './mega-menu';

export default class SiteMenu extends React.Component<{}, {}> {

    public render() {
        return <nav className="site-menu">
            <ul>
                <li className="active"><a href="index.html"><span>Home</span></a>
                </li>
                <MegaMenu />
                <li><a href="account-orders.html"><span>Account</span></a>
                    <ul className="sub-menu">
                        <li><a href="account-login.html">Login / Register</a></li>
                        <li><a href="account-orders.html">Orders List</a></li>
                        <li><a href="account-wishlist.html">Wishlist</a></li>
                        <li><a href="account-profile.html">Profile Page</a></li>
                        <li><a href="account-address.html">Contact / Shipping Address</a></li>
                        <li><a href="account-tickets.html">My Tickets</a></li>
                    </ul>
                </li>
            </ul>
        </nav>;
    }
}