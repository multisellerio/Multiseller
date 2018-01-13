import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps } from "redux-form";

import { Button, Icon, Popconfirm } from "antd";
import {
    AntdSelectComponent, InputNumberComponent, Field, FieldArray
} from "../../shared/util/form-components";

import { UtilServices } from "../../../api/util";
import { ICityModel, IStateModel } from "../../../models/util-models";

import * as _ from "lodash";

export const formName: string = "Shipping-form";

export interface IShippingFormData {
    srilanka: string;
    additionalItem: string;
    additionalShippings: IAdditionalShippingFormData[];
}

export interface IAdditionalShippingFormData {
    stateId: number;
    cityId?: number;
    price: string;
}


interface IShippingFormProps extends InjectedFormProps<IShippingFormData, {}> {
    dispatch?: any;
}

interface IAdditionalFormProps {
    loading: boolean;
    editing: boolean;
    saving: boolean;
    formValues: IShippingFormData;
}

interface IReduxFormProps {
    change: any;
    handleSubmit: any;
    submitting: boolean;
}

interface IShippingFormState {
    states: IStateModel[];
}

interface IAdiitionalShippingFieldArray {
    change: any;
    fields: any;
    states: IStateModel[];
    getCities: (stateId: number) => Promise<ICityModel[]>;
    formValues: IShippingFormData;
}

interface IShippingDetailsItemProps {
    value: IAdditionalShippingFormData;
    item: any;
    states: IStateModel[];
    getCities: (stateId: number) => Promise<ICityModel[]>;
    change: any;
    remove: () => void;
}

interface IShippingDetailsItemState {
    cities: ICityModel[];
}

class ShippingDetailsItemComponent extends React.Component<IShippingDetailsItemProps, IShippingDetailsItemState> {

    constructor(props: IShippingDetailsItemProps) {
        super(props);
        this.state = {
            cities: []
        }
        this.onChangeState = this.onChangeState.bind(this);
    }

    componentWillMount(): void {
        const value = this.props.value;
        if (value && value.stateId !== 0) {
            this.onChangeState(value.stateId, false);
        }
    }

    onChangeState(stateId: number, withCityChange: boolean) {
        if (withCityChange) {
            this.props.change(`${this.props.item}.cityId`, 0);
        }
        this.props.change(`${this.props.item}.price`, 0);
        this.props.getCities(stateId).then((cities) => {
            this.setState({
                cities: cities
            });
        });
    }

    render() {

        let stateOptions = _.map(this.props.states,
            (state: IStateModel) => {
                return {
                    name: state.stateName,
                    value: state.id
                }
            });

        let citiesOptions = [];

        citiesOptions.push({
            name: 'All Cities',
            value: 'all'
        });

        citiesOptions = citiesOptions.concat(_.map(this.state.cities,
            (city: ICityModel) => {
                return {
                    name: city.cityName,
                    value: city.cityId
                }
            }));

        return <tr>
            <td>
                <Field placeholder={`Select a district`} name={`${this.props.item}.stateId`} style={{ width: '70px' }} hideLabel={true} component={AntdSelectComponent} showSearch={true} options={stateOptions} onSelectChange={(stateId) => this.onChangeState(stateId, true)} filterOption={(value, option) => {
                    return option.props.title && option.props.title.toLowerCase().includes(value.toLowerCase());
                }} />
            </td>
            <td>
                <Field placeholder={`Select a city`} name={`${this.props.item}.cityId`} style={{ width: '70px' }} hideLabel={true} component={AntdSelectComponent} showSearch={true} options={citiesOptions} filterOption={(value, option) => {
                    return option.props.title && option.props.title.toLowerCase().includes(value.toLowerCase());
                }} />
            </td>
            <td>
                <Field name={`${this.props.item}.price`} style={{ width: '30px' }} hideLabel={true} precision={2} component={InputNumberComponent} formatter={value => { return `Rs. ${value && typeof value.replace === "function" ? value.replace(/\Rs.\s?|(,*)/g, '') : value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} />
            </td>
            <td>
                <Popconfirm placement="topRight" title="Are you sure delete this shipping detail?" okText="Delete" onConfirm={() => { this.props.remove() }} cancelText="Cancel">
                    <Button icon="delete" size="large"></Button>
                </Popconfirm>
            </td>
        </tr>;
    }

}

const adiitionalShippingFields: React.StatelessComponent<IAdiitionalShippingFieldArray> = (fieldArray: IAdiitionalShippingFieldArray) => {

    const { fields, states, getCities, change, formValues } = fieldArray;

    return <div>
        <div>
            <p><b>Additional Shipping Prices</b></p>
            <p>If you need to add special price for cities, please click the following button and enter the details</p>
        </div>

        <div>
            <Button type={"dashed"} onClick={() => fields.push({ price: 0, cityId: 0, stateId: 0 })}><Icon type="plus-circle-o" /> &nbsp;Add special price</Button>
        </div>

        <br />

        <table className="table">
            <thead>
                <tr>
                    <th>District</th>
                    <th>City</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    fields.map((shippingItem, index) => {
                        const value = formValues
                            ? formValues.additionalShippings
                                ? formValues.additionalShippings[index]
                                : null
                            : null;
                        return <ShippingDetailsItemComponent key={index} remove={() => fields.remove(index)} value={
                            value} change={change} item={shippingItem} states={states} getCities={getCities} />;
                    })
                }
            </tbody>
        </table>
    </div>;
};

class ShippingForm extends React.Component<IShippingFormProps & IAdditionalFormProps, IShippingFormState> {

    constructor(props: IShippingFormProps & IAdditionalFormProps) {
        super(props);
        this.state = {
            states: []
        };
    }

    public static validate(values: IShippingFormData, props: any): FormErrors<IShippingFormData> {

        const errors: FormErrors<IShippingFormData> = {};

        return errors;
    }

    componentWillMount(): void {

        UtilServices.getStates(null).then((states: IStateModel[]) => {
            this.setState({
                states: states
            });
        });

    }

    public render() {

        const { handleSubmit, change } = this.props;

        return <div>
            <div>
                <form onSubmit={handleSubmit}>

                    <div className="row">
                        <Field name="id" component="input" type="hidden" />
                        <Field name="srilanka" component={InputNumberComponent} label="Sri Lanka" precision={2} formatter={value => { return `Rs. ${value && typeof value.replace === "function" ? value.replace(/\Rs.\s?|(,*)/g, '') : value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}  col="col-md-3" />
                        <Field name="additionalItem" component={InputNumberComponent} label="Additional Item" precision={2} formatter={value => { return `Rs. ${value && typeof value.replace === "function" ? value.replace(/\Rs.\s?|(,*)/g, '') : value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}  col="col-md-3" />
                    </div>

                    <hr />
                    <br />

                    <FieldArray formValues={this.props.formValues} component={adiitionalShippingFields} change={change} name="additionalShippings" states={this.state.states} getCities={UtilServices.getCities} />

                    <div className="margin-top-1x">
                        <Button type="primary" onClick={handleSubmit} loading={this.props.loading} >Save Changes</Button>
                    </div>

                </form>
            </div>

        </div>;
    }

}

const form = reduxForm<IShippingFormData, IAdditionalFormProps>({
    form: formName,
    validate: ShippingForm.validate,
})(ShippingForm);


export { form as ShippingForm }
