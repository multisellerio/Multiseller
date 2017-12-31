import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps } from "redux-form";

import { Button } from "antd";
import { InputComponent, TextAreaComponent, Field } from "../../shared/util/form-components";

import * as _ from "lodash";

const formName: string = "store-form";

export interface IStoreFormData {
    shippingInformation: string;
    paymentAndRefundPolicies: string;
    storeName: string;
}

interface IStoreFormProps extends InjectedFormProps<IStoreFormData, {}> {
    dispatch?: any;
}

interface IAdditionalFormProps {
    loading: boolean;
    editing: boolean;
    saving: boolean;
}

interface IReduxFormProps {
    change: any;
    handleSubmit: any;
    submitting: boolean;
}

interface IStoreFormState {

}

class StoreForm extends React.Component<IStoreFormProps & IAdditionalFormProps, IStoreFormState> {

    constructor(props: IStoreFormProps & IAdditionalFormProps) {
        super(props);
        this.state = {

        };
    }

    public static validate(values: IStoreFormData): FormErrors<IStoreFormData> {

        const errors: FormErrors<IStoreFormData> = {};
        return errors;
    }

    componentWillMount(): void {

        if (this.props.editing && this.props.initialValues) {

        }
    }

    public render() {

        const { handleSubmit } = this.props;

        return <div>
            <div>
                <form onSubmit={handleSubmit}>

                    <div className="row">
                        <Field name="storeName" component={InputComponent} label="Store Name" col="col-md-12" />
                        <Field name="shippingInformation" component={TextAreaComponent} label="Shipping Information" col="col-md-12" />
                        <Field name="paymentAndRefundPolicies" component={TextAreaComponent} label="Payment and Refund policies" col="col-md-12" />
                    </div>

                    <div>
                        <Button type="primary" onClick={handleSubmit} loading={this.props.saving} >Save Changes</Button>
                    </div>

                </form>
            </div>

        </div>;
    }

}

const form = reduxForm<IStoreFormData, IAdditionalFormProps>({
    form: formName,
    validate: StoreForm.validate,
})(StoreForm);

export { form as StoreForm }                                                                                                                                                                                                                                                                                