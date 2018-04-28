import { Icon, Menu } from "antd";
import * as React from "react";
import { Link } from "react-router-dom";
const { SubMenu } = Menu;

interface ILayoutProps {
    path: string;
}

interface ILayoutState {
    selectedKeys: string[];
    openKeys: string[];
}

export default class Layout extends React.Component<ILayoutProps, ILayoutState> {

    static isPrivate = true;

    componentWillReceiveProps(nextProps: {readonly [P in "path"]: ILayoutProps[P]}, nextContext): void {
        this.setState({
            selectedKeys: this.props.path.split('/'),
            openKeys: this.props.path.split('/')
        });
    }

    componentWillMount(): void {
        this.setState({
            selectedKeys: this.props.path.split('/'),
            openKeys: this.props.path.split('/')
        });
    }

    public render() {
        return <div className="animated container padding-bottom-3x mb-2">
            <div className="row">
                <div className="col-lg-3">
                    <Menu className="portal-menu" mode="inline" defaultSelectedKeys={this.state.selectedKeys} defaultOpenKeys={this.state.openKeys}>
                        <Menu.Item><span><Icon type="dashboard" /><span>Dashboard</span></span></Menu.Item>
                        <SubMenu key='selling' title={<span><Icon type="shop" /><span>Selling</span></span>}>
                            <Menu.Item>
                                Orders
                            </Menu.Item>
                            <Menu.Item key="products">
                                <Link className="text-decoration-none" to="/portal/selling/products">Products</Link>
                            </Menu.Item>
                            <Menu.Item>
                                Invoices
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu title={<span><Icon type="shopping-cart" /><span>Buying</span></span>}>
                            <Menu.Item>
                                My Orders
                            </Menu.Item>
                            <Menu.Item>
                                Following
                            </Menu.Item>
                            <Menu.Item>
                                Wants
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item>
                            <Link className="text-decoration-none" to="/portal/settings"><Icon type="tool" />&nbsp;Settings</Link>
                        </Menu.Item>
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


