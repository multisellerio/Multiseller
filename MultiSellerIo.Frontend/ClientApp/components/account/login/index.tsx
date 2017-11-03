import * as React from "React";
import { connect } from "react-redux";
import { FormErrors, InjectedFormProps, reduxForm } from "redux-form";

import { Alert, Button } from "antd";

import { ApplicationState } from "../../../store";
import * as AccountState from "../../../store/account";

import { InputComponent, Field } from "../../shared/util/form-components";

interface ILoginFormData {
    username: string;
    password: string;
}

interface IAdditionalLoginFormProps {
    loading: boolean;
}

interface ILoginFormProps extends InjectedFormProps<ILoginFormData, {}> {
}

const ErrorMessageComponent = (error) => {
    const { message } = error;

    if (!message) {
        return <div className="col-md-12 margin-top-1x"></div>;
    }

    return <div className="col-md-12 margin-top-1x"><Alert message="Error" className="margin-bottom-1x" description={message} type="error" closable /></div>;
};

class Form extends React.Component<ILoginFormProps & IAdditionalLoginFormProps, {}> {

    public static validate(values: ILoginFormData) {
        const errors: FormErrors<ILoginFormData> = {};

        if (!values.username) {
            errors.username = "Username is required";
        }

        if (!values.password) {
            errors.password = "Password is required";
        }

        return errors;
    }

    public render() {

        const { handleSubmit } = this.props;

        return <form onSubmit={handleSubmit}>
            <Field type="text" name="username" component={InputComponent} label="Username" col="col-md-12" />
            <Field type="password" name="password" component={InputComponent} label="Password" col="col-md-12" />
            <div className="col-12 text-center text-sm-right">
                <Button type="primary" size="large" onClick={handleSubmit} loading={this.props.loading}>
                    Login
                </Button>
            </div>
        </form>;
    }

}

const LoginForm = reduxForm<ILoginFormData, IAdditionalLoginFormProps>({
    form: "login",
    validate: Form.validate,
})(Form);

type LoginFormProps =
    AccountState.IAccountState
    & typeof AccountState.actionCreator;

class Login extends React.Component<LoginFormProps, {}> {

    constructor(props: LoginFormProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount(): void {
        this.props.setExternalLogin();
    }

    private onSubmit(user: ILoginFormData) {
        this.props.login({
            username: user.username,
            password: user.password,
        });
    }

    public render() {

        return <div>
            <div className="animated fadeIn registration-box-wrapper container padding-bottom-3x mb-2">
                <div className="login-box">
                    <h3 className="text-center">Login to GoodLook</h3>
                    <br />
                    <div className="row social-btn-section">
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block facebook-btn" href={this.props.externalLogin.facebookAuthUrl}><i className="socicon-facebook"></i>&nbsp;Facebook</a></div>
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block twitter-btn" href={this.props.externalLogin.twitterAuthUrl}><i className="socicon-twitter"></i>&nbsp;Twitter</a></div>
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block google-btn" href={this.props.externalLogin.googleAuthUrl}><i className="socicon-googleplus"></i>&nbsp;Google+</a></div>
                    </div>
                    <ErrorMessageComponent message={this.props.errorMessage} />
                    <LoginForm onSubmit={this.onSubmit} loading={this.props.isLoading} />
                </div>
            </div>
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
)(Login) as typeof LoginForm;
