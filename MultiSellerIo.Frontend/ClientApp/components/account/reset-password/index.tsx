import * as React from "React";
import { connect } from "react-redux";
import { FormErrors, InjectedFormProps, reduxForm } from "redux-form";
import { RouteComponentProps } from "react-router-dom";
import { parse } from 'qs';

import { ApplicationState } from "../../../store";
import * as AccountState from "../../../store/account";

import { Button, Alert } from "antd";

import { InputComponent, Field } from "../../shared/util/form-components";

interface IResetPasswordFormData {
    password: string;
    confirmationPassword: string;
}

interface IResetPasswordFormProps extends InjectedFormProps<IResetPasswordFormData, {}> {
}

const MessageComponent = (messageDetails) => {
    const { message, type, title } = messageDetails;

    if (!message) {
        return <div className="margin-top-1x"></div>;
    }

    return <div className="margin-top-1x"><Alert message={title} className="margin-bottom-1x" description={message} type={type} closable /></div>;
};

class Form extends React.Component<IResetPasswordFormProps, {}> {

    public static validate(values: IResetPasswordFormData) {
        const errors: FormErrors<IResetPasswordFormData> = {};

        if (!values.password) {
            errors.password = "Password is required";
        }

        if (!values.confirmationPassword) {
            errors.confirmationPassword = "Confirmation password is required";
        }

        if (values.password !== values.confirmationPassword) {
            errors.confirmationPassword = "Password and confirmation password does not match";
        }

        return errors;
    }

    public render() {

        const { handleSubmit } = this.props;

        return <form className="row" onSubmit={handleSubmit}>
            <Field type="password" name="password" component={InputComponent} label="Password" col="col-md-12" />
            <Field type="password" name="confirmationPassword" component={InputComponent} label="Confirmation Password" col="col-md-12" />
            <div className="col-md-12 text-right">
                <Button type="primary" size="large" onClick={handleSubmit}>
                    Reset Password
                </Button>
            </div>
        </form>;
    }

}

const ResetPasswordForm = reduxForm<IResetPasswordFormData, {}>({
    form: "reset-password",
    validate: Form.validate,
})(Form);

interface IResetPasswordExternalProps {
}

interface IResetPasswordState {
    email: string;
    token: string;
}

type ResetPasswordProps =
    AccountState.IAccountState
    & typeof AccountState.actionCreator & RouteComponentProps<IResetPasswordExternalProps>;

class ResetPassword extends React.Component<ResetPasswordProps, IResetPasswordState> {

    constructor(props: ResetPasswordProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            email: null,
            token: null
        };
    }

    componentWillMount(): void {
        const query = parse(this.props.location.search.substr(1));
        this.setState({
            email: query.email,
            token: query.token
        });
    }

    private onSubmit(resetPasswordData: IResetPasswordFormData) {
        this.props.resetPassword({
            email: this.state.email,
            password: resetPasswordData.password,
            confirmationPassword: resetPasswordData.confirmationPassword,
            token: this.state.token
        });
    }

    public render() {
        return <div>
            <div className="animated fadeIn registration-box-wrapper container padding-bottom-3x mb-2">
                <div className="reset-password-box">
                    <h3 className="margin-bottom-1x text-center">Reset your password</h3>
                    {!this.props.resetPasswordState.success && <p>You have requested to reset the password <br />for <b>{this.state.email}</b></p>}
                    <MessageComponent message={this.props.resetPasswordState.message} type={this.props.resetPasswordState.success ? "success" : "error"}
                        title={this.props.resetPasswordState.success ? "Success" : "Error"} />
                    {!this.props.resetPasswordState.success && <ResetPasswordForm onSubmit={this.onSubmit} />}
                </div>
            </div>
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
)(ResetPassword) as typeof ResetPassword;
