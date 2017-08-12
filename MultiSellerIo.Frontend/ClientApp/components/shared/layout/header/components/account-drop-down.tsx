import * as React from 'react';

export default class AccountDropDown extends React.Component<{}, {}> {

    public render() {
        return <div className="account"><a href="account-orders.html"></a><i className="icon-head"></i>
            <ul className="toolbar-dropdown">
                <li className="sub-menu-title"><span>Hello,</span> Daniel Adams</li>
                <li><a href="account-profile.html">My Profile</a></li>
                <li><a href="account-orders.html">Orders List</a></li>
                <li><a href="account-wishlist.html">Wishlist</a></li>
                <li className="sub-menu-separator"></li>
                <li><a href="#"> <i className="icon-unlock"></i>Logout</a></li>
            </ul>
        </div>;
    }
}