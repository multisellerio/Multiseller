import * as React from 'React';
import { connect } from 'react-redux';
import { reduxForm, Field, FormProps, FormErrors } from 'redux-form';

import { ApplicationState } from '../../../store';
import * as AccountState from '../../../store/account';

import { InputComponent } from '../../shared/util/form-components';
import { Alert } from '../../shared/util/alert';

interface ILoginFormData {
    username: string,
    password: string,
}

interface ILoginFormProps extends FormProps<ILoginFormData, {}, {}> {
    onSubmit: any,
    handleSubmit?: any,
}

const ErrorMessageComponent = error => {
    const { message } = error;

    if (!message)
        return null;

    return <Alert message={message} title="Error" type="alert-danger" />;

}

@reduxForm<ILoginFormData, {}, {}>({
    form: 'login',
    validate: LoginForm.validate,
})
class LoginForm extends React.Component<ILoginFormProps, {}> {

    genderOptions = [
        { name: 'Male', value: 1 },
        { name: 'Female', value: 2 },
        { name: 'Unspecifed', value: 3 }
    ];

    static validate(values: ILoginFormData) {
        let errors: FormErrors<ILoginFormData> = {};

        if (!values.username) {
            errors.username = 'Username is required';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        }

        return errors;
    }

    public render() {

        const { handleSubmit } = this.props;

        return <form onSubmit={handleSubmit}>
            <Field type="text" name="username" component={InputComponent} label="Username" col="col-md-12" />
            <Field type="password" name="password" component={InputComponent} label="Password" col="col-md-12" />
            <div className="col-12 text-center text-sm-right">
                <button className="btn btn-primary margin-bottom-none" type="submit">Login</button>
            </div>
        </form>;
    }

}

type LoginFormProps =
    AccountState.IAccountState
    & typeof AccountState.actionCreator;

class Login extends React.Component<LoginFormProps, {}> {

    constructor(props: LoginFormProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(user: ILoginFormData) {
        this.props.login({
            username: user.username,
            password: user.password
        });
    }

    public render() {
        return <div>
            <div className="animated fadeIn registration-box-wrapper container padding-bottom-3x mb-2">
                <div className="registration-box">
                    <h3 className="margin-bottom-1x text-center">Login to GoodLook</h3>
                    <br/>
                    <div className="row margin-bottom-1x social-btn-section">
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block facebook-btn" href="#"><i className="socicon-facebook"></i>&nbsp;Facebook</a></div>
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block twitter-btn" href="#"><i className="socicon-twitter"></i>&nbsp;Twitter</a></div>
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block google-btn" href="#"><i className="socicon-googleplus"></i>&nbsp;Google+</a></div>
                    </div>
                    <ErrorMessageComponent message={this.props.errorMessage} />
                    <LoginForm onSubmit={this.onSubmit} />
                </div>
            </div>
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator
)(Login) as typeof LoginForm;


