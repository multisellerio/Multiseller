import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps } from "redux-form";

import { Button } from "antd";
import { Field, PasswordComponent } from "../../shared/util/form-components";

import * as _ from "lodash";

export const formName: string = "change-password-form";

export interface IChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface IChangePasswordFormProps extends InjectedFormProps<IChangePasswordFormData, {}> {
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

class ChangePasswordForm extends React.Component<IChangePasswordFormProps & IAdditionalFormProps, IStoreFormState> {

    constructor(props: IChangePasswordFormProps & IAdditionalFormProps) {
        super(props);
        this.state = {

        };
    }

    public static validate(values: IChangePasswordFormData): FormErrors<IChangePasswordFormData> {

        const errors: FormErrors<IChangePasswordFormData> = {};

        if (!values.currentPassword) {
            errors.currentPassword = "Current password is required";
        }

        if (!values.newPassword) {
            errors.newPassword = "New password is required";
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = "Confirmation password is required";
        }

        if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
            errors.confirmPassword = "Password doesnot match";
        }

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
                        <Field name="currentPassword" component={PasswordComponent} type="password" label="Current Password" col="col-md-12" />
                        <Field name="newPassword" type="password" component={PasswordComponent} label="New Password" col="col-md-12" />
                        <Field name="confirmPassword" type="password" component={PasswordComponent} label="Confirm Password" col="col-md-12" />
                    </div>

                    <div>
                        <Button type="primary" onClick={handleSubmit} loading={this.props.loading} >Change Password</Button>
                    </div>

                </form>
            </div>

        </div>;
    }

}

const form = reduxForm<IChangePasswordFormData, IAdditionalFormProps>({
    form: formName,
    validate: ChangePasswordForm.validate,
})(ChangePasswordForm);

export { form as ChangePasswordForm }                                                                                                                                                                                                                                                                                