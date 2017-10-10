 import * as React from "react";
 import { Link } from "react-router-dom";

 interface IAccountDropDownProps {
    username: string;
    isAuthorize: boolean;
    logOff();
}

 export default class AccountDropDown extends React.Component<IAccountDropDownProps, {}> {

    constructor(props: IAccountDropDownProps) {
        super(props);
        this.logOff = this.logOff.bind(this);
    }

    public logOff() {
        this.props.logOff();
    }

    public render() {

        const { isAuthorize, username } = this.props;

        if (!isAuthorize) {
            return <div className="account"><Link to="/account/login" /><i className="icon-lock"></i>
            </div>;
        }

        return <div className="account"><a></a><i className="icon-head"></i>
            <ul className="toolbar-dropdown">
                <li className="sub-menu-title"><span>Hello,</span> {username}</li>
                <li><a href="account-profile.html">My Profile</a></li>
                <li><a href="account-orders.html">Orders List</a></li>
                <li><a href="account-wishlist.html">Wishlist</a></li>
                <li className="sub-menu-separator"></li>
                <li><a onClick={this.logOff}> <i className="icon-unlock"></i>Logout</a></li>
            </ul>
        </div>;
    }
}
