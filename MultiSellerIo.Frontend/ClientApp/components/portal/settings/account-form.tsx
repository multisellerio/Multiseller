import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps, arrayPush, arrayRemoveAll } from "redux-form";

import { Button, Icon, Modal, Upload, Avatar, Popconfirm, Badge, Alert } from "antd";
import {
    AntdSelectComponent, InputComponent,
    SelectCascader, TextAreaComponent, InputNumberComponent, Field, FieldArray
} from "../../shared/util/form-components";

import * as Api from "../../../api";

import * as _ from "lodash";

const formName: string = "account-form";

export interface IAccountFormData {

}


interface IAccountFormProps extends InjectedFormProps<IAccountFormData, {}> {
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

interface IAccountFormState {

}

class AccountForm extends React.Component<IAccountFormProps & IAdditionalFormProps, IAccountFormState> {

    constructor(props: IAccountFormProps & IAdditionalFormProps) {
        super(props);
        this.state = {

        };
    }

    public static validate(values: IAccountFormData, props: any): FormErrors<IAccountFormData> {

        const errors: FormErrors<IAccountFormData> = {};

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
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Picture</label><br />
                                <div>
                                    <Avatar shape="square" icon="user" size={"large"} className={"align-middle"} /> &nbsp;
                                    <Upload className={"align-middle"}>
                                        <Button size={"default"} type={"dashed"}>
                                            <Icon type="upload" /> Click to Upload
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <Field name="id" component="input" type="hidden" />
                        <Field name="username" component={InputComponent} label="Username" col="col-md-12" />
                        <Field name="firstname" component={InputComponent} label="First Name" col="col-md-6" />
                        <Field name="lastname" component={InputComponent} label="Last Name" col="col-md-6" />
                        <Field name="email" component={InputComponent} label="Email" col="col-md-12" />
                    </div>

                    <div>
                        <Button type="primary" onClick={handleSubmit} loading={this.props.loading} >Save Changes</Button>
                    </div>

                </form>
            </div>

        </div>;
    }

}

const form = reduxForm<IAccountFormData, IAdditionalFormProps>({
    form: formName,
    validate: AccountForm.validate,
})(AccountForm);

export { form as AccountForm }
