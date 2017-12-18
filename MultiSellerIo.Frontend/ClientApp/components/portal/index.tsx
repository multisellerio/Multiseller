import * as React from "react";
import { RouteComponentProps, Route } from "react-router-dom";
import Layout from "./layout";

import Products from "./products";
import AddProduct from "./products/add-product";
import EditProduct from "./products/edit-product";
import Settings from './settings';

interface IPortalState {
    path: string;
}

type PortalProps = RouteComponentProps<any>;

export default class Portal extends React.Component<PortalProps, IPortalState> {

    private hashListner = null;

    constructor(props: PortalProps) {
        super(props);
        this.state = {
            path: this.props.location.pathname
        }
    }

    componentWillMount(): void {
        this.hashListner = this.props.history.listen((location) => {
            this.setState({
                path : location.pathname
            });
        });
    }

    componentWillUnmount(): void {
        this.hashListner = null;
    }

    public render() {
        return <div>
            <Layout path={this.state.path}>
                <Route exact path="/portal/selling/products" component={Products} />
                <Route path="/portal/selling/products/add-product" component={AddProduct} />
                <Route path="/portal/selling/products/edit-product/:id" component={EditProduct} />
                <Route path="/portal/settings" component={Settings} />
            </Layout>
        </div>;
    }
}
