import * as React from 'React';
import { connect } from 'react-redux';
import { reduxForm, Field, FormProps, FormErrors } from 'redux-form';

import { ApplicationState } from '../../../store';
import * as RegisterState from '../../../store/account';

interface IRegisterFormData {
    username: string,
    password: string,
    confirmationPassword: string,
    email: string,
}

interface IRegisterFormProps extends FormProps<IRegisterFormData, {}, {}> {
    onSubmit: any,
    handleSubmit?: any,
}

const renderInput = field => {
    const { input, label, type } = field;
    return <div className="col-sm-6">
        <div className={field.meta.touched && field.meta.error ? 'form-group has-danger' : 'form-group'}>
            <label>{label}</label>
            <input className="form-control" type={type} {...input} />
            {field.meta.touched && field.meta.error && <div className="form-control-feedback">{field.meta.error}</div>}
        </div>
    </div>;
}

@reduxForm<IRegisterFormData, {}, {}>({
    form: 'register',
    validate: RegisterForm.validate,
})
class RegisterForm extends React.Component<IRegisterFormProps, {}> {

    static validate(values: IRegisterFormData) {
        let errors: FormErrors<IRegisterFormData> = {};

        if (!values.username) {
            errors.username = 'Username is required';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        }

        if (!values.confirmationPassword) {
            errors.confirmationPassword = 'Confirmation password is required';
        }

        if (values.password !== values.confirmationPassword) {
            errors.confirmationPassword = "Password and confirmation password does not match";
        }

        if (!values.email) {
            errors.email = 'Email is required';
        }
        return errors;
    }

    public render() {

        const { handleSubmit } = this.props;

        return <form className="row" onSubmit={handleSubmit}>
            <Field type="text" name="username" component={renderInput} label="Username" />
            <Field type="email" name="email" component={renderInput} label="Email" />
            <Field type="password" name="password" component={renderInput} label="Password"  />
            <Field type="password" name="confirmationPassword" component={renderInput} label="Confirmation Password" />
            <div className="col-12 text-center text-sm-right">
                <button className="btn btn-primary margin-bottom-none" type="submit">Register</button>
            </div>
        </form>;
    }

}

type RegisterFormProps =
    RegisterState.IRegisterState
    & typeof RegisterState.actionCreator;

class Register extends React.Component<RegisterFormProps, {}> {

    constructor(props: RegisterFormProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(user: IRegisterFormData) {
        this.props.userRegister({
            id: 0,
            username: user.username,
            password: user.password,
            email: user.email
        });
    }

    public render() {
        return <div>
            <div className="page-title">
                <div className="container">
                    <div className="column">
                        <h1>Login / Register Account</h1>
                    </div>
                    <div className="column">
                        <ul className="breadcrumbs">
                            <li><a href="index.html">Home</a>
                            </li>
                            <li className="separator">&nbsp;</li>
                            <li><a href="account-orders.html">Account</a>
                            </li>
                            <li className="separator">&nbsp;</li>
                            <li>Login / Register</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container padding-bottom-3x mb-2">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="margin-bottom-1x">No Account? Register</h3>
                        <p>Registration takes less than a minute but gives you full control over your orders.</p>
                    </div>
                    <RegisterForm onSubmit={this.onSubmit} />
                </div>
            </div>
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    RegisterState.actionCreator
)(Register) as typeof Register;


