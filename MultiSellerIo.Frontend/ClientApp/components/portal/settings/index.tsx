import * as React from "React";
import { connect } from "react-redux";
import { parse } from 'qs';
import { UnregisterCallback } from 'history';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ApplicationState } from "../../../store";
import * as ProductState from "../../../store/products";
import { Alert, Spin, Pagination, Card, Input, Icon, Tabs } from "antd";
import { IProductListModel } from "../../../models/product-models";
import * as _ from 'lodash';

import { animateScroll } from 'react-scroll';

import { AccountForm } from './account-form';
import { StoreForm } from './store-form';
import { ShippingForm } from './shipping-form';

import { AccountDetails } from './account-details';

import * as Api from "../../../api";

const TabPane = Tabs.TabPane;

interface ISettingsState {

}

type SettingsProps =
    ProductState.IProductsState
    & typeof ProductState.actionCreator
    & RouteComponentProps<any>;
class SettingsComponents extends React.Component<SettingsProps, ISettingsState> {

    private routeListener: UnregisterCallback = null;

    constructor(props: SettingsProps) {
        super(props);

        this.state = {

        }

    }

    scrollToTop(): void {
        animateScroll.scrollToTop({
            duration: 500,
            delay: 0,
            smooth: true,
            offset: 50
        });
    }

    public render() {
        return <div>
            <div className="row">
                <div className="col-md-12">
                    <h3 className="mt-1">Settings</h3>
                    <p>Your current settings</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card-container">
                        <Tabs type="card" defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="profile" />Account</span>} key="1">
                                <Card type={"inner"} title={"Account Info"}>
                                    <AccountForm loading={false} editing={false} />
                                </Card>
                            </TabPane>
                            <TabPane tab={<span><Icon type="shop" />Store</span>} key="2">
                                <Card type={"inner"} title={"Store policies"}>
                                    <StoreForm loading={false} editing={false} />
                                </Card>
                                <br />
                                <Card type={"inner"} title={"Shipping Info"}>
                                    <p>How much will shipping cost your buyer?</p>
                                    <ShippingForm loading={false} editing={false} />
                                </Card>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator,
)(SettingsComponents) as typeof SettingsComponents;
