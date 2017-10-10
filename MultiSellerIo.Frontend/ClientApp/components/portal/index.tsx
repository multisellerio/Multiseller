 import * as React from "react";
 import { Route } from "react-router-dom";
 import Layout from "./layout";

 import Products from "./products";
 import AddProduct from "./products/add-product";

 export default class Portal extends React.Component<{}, {}> {
    public render() {
        return <Layout>
            <Route exact path="/portal/products" component={Products} />
            <Route path="/portal/products/add-product" component={AddProduct} />
        </Layout>;
    }
}
