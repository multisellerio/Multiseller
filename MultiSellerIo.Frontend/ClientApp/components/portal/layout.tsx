 import { Icon, Menu, Switch } from "antd";
 import * as React from "react";
 const { SubMenu } = Menu;

 export default class Layout extends React.Component<{}, {}> {
    public render() {
        return <div className="animated fadeIn container padding-bottom-3x mb-2">
            <div className="row">
                <div className="col-lg-3">
                    <Menu className="portal-menu" mode="inline">
                        <SubMenu title={<span><Icon type="bars" /><span>Products</span></span>}>
                            <Menu.Item>
                                <Icon type="plus-circle-o" />
                                New Product
                                </Menu.Item>
                            <Menu.Item>

                                Product List
                                </Menu.Item>
                        </SubMenu>
                        <SubMenu title={<span><Icon type="book" /><span>Orders</span></span>}>
                        </SubMenu>
                        <SubMenu title={<span><Icon type="message" /><span>Messages</span></span>}>
                        </SubMenu>
                        <SubMenu title={<span><Icon type="user" /><span>My Account</span></span>}>
                        </SubMenu>
                        <SubMenu title={<span><Icon type="tool" /><span>Settings</span></span>}>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-lg-9">
                    <div className="portal-content-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>;
    }
}
