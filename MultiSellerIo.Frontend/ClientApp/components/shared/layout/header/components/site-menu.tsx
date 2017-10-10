 import * as React from "react";
 import NavItem from "../../../util/nav-item";
 import MegaMenu from "./mega-menu";

 export default class SiteMenu extends React.Component<{}, {}> {

    public render() {
        return <nav className="site-menu">
            <ul>
                <NavItem exact={true} to="/"><span>Home</span></NavItem>
                <NavItem to="/portal/products"><span>My Account</span></NavItem>
                <MegaMenu />
            </ul>
        </nav>;
    }
}
