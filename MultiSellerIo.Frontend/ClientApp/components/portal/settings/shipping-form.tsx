import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps, arrayPush, arrayRemoveAll } from "redux-form";

import { Button, Icon, Modal, Upload, Avatar, Popconfirm, Badge, Alert } from "antd";
import {
    AntdSelectComponent, InputComponent,
    SelectCascader, TextAreaComponent, InputNumberComponent, Field, FieldArray
} from "../../shared/util/form-components";

import * as Api from "../../../api";

import * as _ from "lodash";

const formName: string = "Shipping-form";

export interface IShippingFormData {

}


interface IShippingFormProps extends InjectedFormProps<IShippingFormData, {}> {
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

interface IShippingFormState {

}

class ShippingForm extends React.Component<IShippingFormProps & IAdditionalFormProps, IShippingFormState> {

    constructor(props: IShippingFormProps & IAdditionalFormProps) {
        super(props);
        this.state = {

        };
    }

    public static validate(values: IShippingFormData, props: any): FormErrors<IShippingFormData> {

        const errors: FormErrors<IShippingFormData> = {};

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
                        <Field name="srilanka" component={InputNumberComponent} label="Rest Of Sri Lanka" col="col-md-12" />
                    </div>

                    <div className="margin-bottom-1x">
                        <Alert message="Additional Shipping Prices" type="info" showIcon description={"If you need to add special price for cities, please click the following button and enter the details"} />
                    </div>

                    <div>
                        <Button type={"dashed"}><Icon type="plus-circle-o" /> &nbsp;Add special price</Button>
                    </div>

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
