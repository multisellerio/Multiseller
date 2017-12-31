﻿import * as React from "React";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { UnregisterCallback } from 'history';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ApplicationState } from "../../../store";
import * as SettingState from "../../../store/settings";
import { Alert, Spin, Card, Icon, Tabs } from "antd";
import * as _ from 'lodash';


import { animateScroll } from 'react-scroll';
import { AccountForm, IAccountFormData } from './account-form';
import { StoreForm, IStoreFormData } from './store-form';
import { ShippingForm, formName as ShippingFormName } from './shipping-form';

import * as Api from "../../../api";

const TabPane = Tabs.TabPane;

interface ISettingsState {

}

type SettingsProps =
    { settings: SettingState.ISettingsState, formValues: any }
    & typeof SettingState.actionCreator
    & RouteComponentProps<any>;
class SettingsComponents extends React.Component<SettingsProps, ISettingsState> {

    private routeListener: UnregisterCallback = null;

    constructor(props: SettingsProps) {
        super(props);

        this.state = {

        }

        this.onSubmitAccountForm = this.onSubmitAccountForm.bind(this);
        this.onSubmitStoreForm = this.onSubmitStoreForm.bind(this);

    }

    componentWillMount(): void {
        this.props.getProfile();
        this.props.getStore();
        this.scrollToTop();
    }

    scrollToTop(): void {
        animateScroll.scrollToTop({
            duration: 500,
            delay: 0,
            smooth: true,
            offset: 50
        });
    }

    onSubmitAccountForm(data: IAccountFormData) {
        this.props.updateProfile({
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            profileImage: data.profileImage
        });
    }

    onSubmitStoreForm(data: IStoreFormData) {
        this.props.updateStore({
            storeName: data.storeName,
            shippingInformation: data.shippingInformation,
            paymentAndRefundPolicies: data.paymentAndRefundPolicies,
            verified: false,
            shippingCosts: null
        });
    }

    public render() {

        const profile = this.props.settings.profile ? this.props.settings.profile.data : null;
        const store = this.props.settings.store.data ? this.props.settings.store.data : null;

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
                                {this.props.settings.profile.loading && <div className="text-center margin-top-1x"><Spin size="large" /></div>}
                                {!this.props.settings.profile.loading && <Card type={"inner"} title={"Account Info"}>
                                    {(this.props.settings.profile.error) && <div className="margin-top-1x margin-bottom-1x">
                                        <Alert
                                            message="Error"
                                            description={this.props.settings.profile.error}
                                            type="error"
                                            showIcon
                                        />
                                    </div>}
                                    <AccountForm loading={false} editing={false} saving={this.props.settings.profile.saving} initialValues={profile} onSubmit={this.onSubmitAccountForm} />
                                </Card>}
                            </TabPane>
                            <TabPane tab={<span><Icon type="shop" />Store</span>} key="2">
                                <Card type={"inner"} title={"Store policies"}>
                                    <StoreForm loading={false} editing={false} saving={this.props.settings.store.saving} initialValues={store} onSubmit={this.onSubmitStoreForm} />
                                </Card>
                                <br />
                                <Card type={"inner"} title={"Shipping Info"}>
                                    <p>How much will shipping cost your buyer?</p>
                                    <ShippingForm formValues={this.props.formValues} saving={this.props.settings.store.saving} loading={false} editing={false} />
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
    (state: ApplicationState) => {
        const formValues = getFormValues(ShippingFormName)(state) || {};
        return {
            settings: state.settings,
            formValues: formValues
        }
    },
    SettingState.actionCreator,
)(SettingsComponents) as typeof SettingsComponents;