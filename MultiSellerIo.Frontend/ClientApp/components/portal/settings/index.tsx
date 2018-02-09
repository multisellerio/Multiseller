import * as React from "React";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { UnregisterCallback } from 'history';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ApplicationState } from "../../../store";
import * as SettingState from "../../../store/settings";
import { Alert, Spin, Card, Icon, Tabs } from "antd";
import * as _ from 'lodash';

import { IStoreModel, IShippingCostModel, ShippingCostType } from '../../../models/store-models';

import { animateScroll } from 'react-scroll';
import { AccountForm, IAccountFormData } from './account-form';
import { StoreForm, IStoreFormData } from './store-form';
import { ChangePasswordForm, IChangePasswordFormData } from './change-password-form';
import { ShippingForm, formName as ShippingFormName, IShippingFormData, IAdditionalShippingFormData } from './shipping-form';

import * as Api from "../../../api";

const TabPane = Tabs.TabPane;

interface ISettingsState {

}

type SettingsProps =
    { settings: SettingState.ISettingsState, shippingFormValues: IShippingFormData }
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
        this.onSubmitShippingForm = this.onSubmitShippingForm.bind(this);
        this.onSubmitChangePasswordForm = this.onSubmitChangePasswordForm.bind(this);
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

    onSubmitShippingForm(data: IShippingFormData) {
        let shippingData = this.toShippingData(data);
        this.props.updateShipping(shippingData);
    }

    onSubmitChangePasswordForm(data: IChangePasswordFormData) {
        this.props.changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmationPassword: data.confirmPassword
        });
    }

    private toShippingFormData(store: IStoreModel): IShippingFormData {

        if (store == null) {
            return {
                srilanka: 'Rs. 0',
                additionalItem: 'Rs. 0',
                additionalShippings: []
            }
        }

        if (store.shippingInformation == null || store.shippingInformation.length === 0) {
            return {
                srilanka: 'Rs. 0',
                additionalItem: 'Rs. 0',
                additionalShippings: []
            }
        }

        let sriLankaShippingInformation = _.find(store.shippingCosts, { shippingCostType: 1, countryId: null, cityId: null });
        let additionalShippingInformation = _.find(store.shippingCosts, { shippingCostType: 999, countryId: null, cityId: null });


        let shippingCosts: IShippingCostModel[] = _.filter(store.shippingCosts, { shippingCostType: 3 });

        let additionalShippings: IAdditionalShippingFormData[] = _.map(shippingCosts,
            (shippingCost: IShippingCostModel) => {
                return {
                    stateId: shippingCost.stateId,
                    cityId: shippingCost.cityId,
                    price: `Rs. ${shippingCost.cost}`
                }
            });

        return {
            srilanka: sriLankaShippingInformation ? `Rs. ${sriLankaShippingInformation.cost}` : 'Rs. 0',
            additionalItem: additionalShippingInformation ? `Rs. ${additionalShippingInformation.cost}` : 'Rs. 0',
            additionalShippings: additionalShippings
        }
    }

    private toShippingData(data: IShippingFormData): IShippingCostModel[] {

        if (data == null) {
            return null;
        }

        let additionalShippings: IShippingCostModel[] = [];

        //Sri lanka shipping
        additionalShippings.push({
            cost: Number(data.srilanka.replace("Rs. ", "").replace(",", "")),
            cityId: null,
            countryId: null,
            id: 0,
            shippingCostType: ShippingCostType.Flat
        });

        //additional shipping
        additionalShippings.push({
            cost: Number(data.additionalItem.replace("Rs. ", "").replace(",", "")),
            cityId: null,
            countryId: null,
            id: 0,
            shippingCostType: ShippingCostType.AdditionalItem
        });

        let otherItems = _.map(data.additionalShippings,
            (additionalShipping: IAdditionalShippingFormData) => {
                return {
                    cost: Number(additionalShipping.price.replace("Rs. ", "").replace(",", "")),
                    cityId: additionalShipping.cityId,
                    countryId: null,
                    id: 0,
                    shippingCostType: ShippingCostType.City
                }
            });

        additionalShippings = additionalShippings.concat(otherItems);

        return additionalShippings;
    }

    public render() {

        const profile = this.props.settings.profile ? this.props.settings.profile.data : null;
        const store = this.props.settings.store.data ? this.props.settings.store.data : null;
        const shipping = this.toShippingFormData(this.props.settings.store.data);

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
                                <br />
                                {!this.props.settings.profile.loading && <Card type={"inner"} title={"Change Password"}>
                                    <ChangePasswordForm onSubmit={this.onSubmitChangePasswordForm} loading={this.props.settings.changePassword.loading} editing={false} />
                                </Card>}
                            </TabPane>
                            <TabPane tab={<span><Icon type="shop" />Store</span>} key="2">
                                <Card type={"inner"} title={"Store policies"}>
                                    <StoreForm loading={false} editing={false} saving={this.props.settings.store.saving} initialValues={store} onSubmit={this.onSubmitStoreForm} />
                                </Card>
                                <br />
                                <Card type={"inner"} title={"Shipping Info"}>
                                    <p>How much will shipping cost your buyer?</p>
                                    <ShippingForm initialValues={shipping} formValues={this.props.shippingFormValues} saving={this.props.settings.store.saving} onSubmit={this.onSubmitShippingForm} loading={false} editing={false} />
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
        const shippingFormValues = getFormValues(ShippingFormName)(state) || {};
        return {
            settings: state.settings,
            shippingFormValues: shippingFormValues
        }
    },
    SettingState.actionCreator,
)(SettingsComponents) as typeof SettingsComponents;
