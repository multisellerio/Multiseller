import * as React from "React";
import { connect } from "react-redux";
import { FormErrors, InjectedFormProps, reduxForm } from "redux-form";

import { ApplicationState } from "../../../store";
import * as AccountState from "../../../store/account";

import { Button, Alert } from "antd";

import { InputComponent, Field } from "../../shared/util/form-components";

interface IForgetPasswordFormData {
    email: string;
}

interface IForgetPasswordFormProps extends InjectedFormProps<IForgetPasswordFormData, {}> {
}

interface IAdditionalForgetPasswordFormProps {
    loading: boolean;
}

const MessageComponent = (messageDetails) => {
    const { message, type, title } = messageDetails;

    if (!message) {
        return <div className="margin-top-1x"></div>;
    }

    return <div className="margin-top-1x"><Alert message={title} className="margin-bottom-1x" description={message} type={type} closable /></div>;
};

class Form extends React.Component<IForgetPasswordFormProps & IAdditionalForgetPasswordFormProps, {}> {

    public static validate(values: IForgetPasswordFormData) {
        const errors: FormErrors<IForgetPasswordFormData> = {};

        if (!values.email) {
            errors.email = "Email is required";
        }

        return errors;
    }

    public render() {

        const { handleSubmit } = this.props;

        return <form className="row" onSubmit={handleSubmit}>
            <Field type="email" name="email" component={InputComponent} label="Email" col="col-md-12" />
            <div className="col-md-12 text-right">
                <Button type="primary" size="large" loading={this.props.loading} onClick={handleSubmit}>
                    Reset Password
                </Button>
            </div>
        </form>;
    }

}

const ForgetPasswordForm = reduxForm<IForgetPasswordFormData, IAdditionalForgetPasswordFormProps>({
    form: "forget-password",
    validate: Form.validate,
})(Form);

type ForgetPasswordProps =
    AccountState.IAccountState
    & typeof AccountState.actionCreator;

class ForgetPassword extends React.Component<ForgetPasswordProps, {}> {

    constructor(props: ForgetPasswordProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(forgetPasswordFormData: IForgetPasswordFormData) {
        this.props.forgetPassword(forgetPasswordFormData.email);
    }

    public render() {
        return <div>
            <div className="animated fadeIn registration-box-wrapper container padding-bottom-3x mb-2">
                <div className="reset-password-box">
                    <h3 className="margin-bottom-1x text-center">Forget Password</h3>
                    {!this.props.forgetPasswordState.success && <div>
                        <p className="text-center">We will send you a link to reset your password.</p>
                    </div>}
                    <MessageComponent message={this.props.forgetPasswordState.message} type={this.props.forgetPasswordState.success ? "success" : "error"}
                        title={this.props.forgetPasswordState.success ? "Success" : "Error"} />
                    {!this.props.forgetPasswordState.success && <ForgetPasswordForm loading={this.props.forgetPasswordState.isLoading} onSubmit={this.onSubmit} />}
                </div>
            </div>
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
)(ForgetPassword) as typeof ForgetPassword;
