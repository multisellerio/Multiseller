import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps, arrayPush, arrayRemoveAll } from "redux-form";

import { Button, Icon, Modal, Upload, Avatar, Popconfirm, Badge, Alert } from "antd";
import {
    AntdSelectComponent, InputComponent,
    SelectCascader, TextAreaComponent, InputNumberComponent, Field, FieldArray
} from "../../shared/util/form-components";

import * as Api from "../../../api";

import * as _ from "lodash";

const formName: string = "Store-form";

export interface IStoreFormData {

}


interface IStoreFormProps extends InjectedFormProps<IStoreFormData, {}> {
    dispatch?: any;
}

interface IAdditionalFormProps {
    loading: boolean;
    editing: boolean;
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

    public static validate(values: IStoreFormData, props: any): FormErrors<IStoreFormData> {

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
                        <Field name="id" component="input" type="hidden" />
                        <Field name="shippinginfo" component={TextAreaComponent} label="Shipping Information" col="col-md-12" />
                        <Field name="paymentandrefoundinfo" component={TextAreaComponent} label="Payment and Refund policies" col="col-md-12" />
                    </div>

                    <div>
                        <Button type="primary" onClick={handleSubmit} loading={this.props.loading} >Save Changes</Button>
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
