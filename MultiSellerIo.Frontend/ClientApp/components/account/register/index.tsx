﻿import * as React from 'React';
import { connect } from 'react-redux';
import { reduxForm, Field, FormProps, FormErrors } from 'redux-form';

import { ApplicationState } from '../../../store';
import * as AccountState from '../../../store/account';

import { InputComponent, SelectComponent } from '../../shared/util/form-components';
import { Alert } from '../../shared/util/alert';

interface IRegisterFormData {
    firstName: string,
    lastName: string,
    gender: number,
    username: string,
    password: string,
    confirmationPassword: string,
    email: string,
}

interface IRegisterFormProps extends FormProps<IRegisterFormData, {}, {}> {
    onSubmit: any,
    handleSubmit?: any,
}

const ErrorMessageComponent = error => {
    const { message } = error;

    if (!message)
        return null;

    return <Alert message={message} title="Error" type="alert-danger" />;

}

@reduxForm<IRegisterFormData, {}, {}>({
    form: 'register',
    validate: RegisterForm.validate,
})
class RegisterForm extends React.Component<IRegisterFormProps, {}> {

    genderOptions = [
        { name: 'Male', value: 1 },
        { name: 'Female', value: 2 },
        { name: 'Unspecifed', value: 3 }
    ];

    static validate(values: IRegisterFormData) {
        let errors: FormErrors<IRegisterFormData> = {};

        if (!values.firstName) {
            errors.firstName = 'First Name is required';
        }

        if (!values.lastName) {
            errors.lastName = 'Last Name is required';
        }

        if (!values.username) {
            errors.username = 'Username is required';
        }

        if (!values.gender) {
            errors.gender = 'Gender is required';
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
            <Field type="text" name="firstName" component={InputComponent} label="First Name" col="col-md-6" />
            <Field type="text" name="lastName" component={InputComponent} label="Last Name" col="col-md-6" />
            <Field type="text" name="username" component={InputComponent} label="Username" col="col-md-6" />
            <Field name="gender" component={SelectComponent} label="Gender" options={this.genderOptions} col="col-md-6" />
            <Field type="email" name="email" component={InputComponent} label="Email" col="col-md-12" />
            <Field type="password" name="password" component={InputComponent} label="Password" col="col-md-6" />
            <Field type="password" name="confirmationPassword" component={InputComponent} label="Confirmation Password" col="col-md-6" />
            <div className="col-md-12 text-center">
                <button className="btn btn-primary margin-bottom-none submit-button" type="submit">Register</button>
            </div>
        </form>;
    }

}

type RegisterFormProps =
    AccountState.IAccountState
    & typeof AccountState.actionCreator;

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
            confirmationPassword: user.confirmationPassword,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender
        });
    }

    public render() {
        return <div>
            <div className="registration-box-wrapper container padding-bottom-3x mb-2">
                <div className="registration-box">
                    <h3 className="margin-bottom-1x text-center">Signup with GoodLook</h3>
                    <h6 className="sub-header margin-bottom-1x">- Easily using -</h6>
                    <div className="row margin-bottom-1x social-btn-section">
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block facebook-btn" href="#"><i className="socicon-facebook"></i>&nbsp;Facebook</a></div>
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block twitter-btn" href="#"><i className="socicon-twitter"></i>&nbsp;Twitter</a></div>
                        <div className="col-xl-4 col-md-6 col-sm-4 social-btn"><a className="btn btn-sm btn-block google-btn" href="#"><i className="socicon-googleplus"></i>&nbsp;Google+</a></div>
                    </div>
                    <h6 className="sub-header margin-bottom-1x">- Or -</h6>
                    <ErrorMessageComponent message={this.props.errorMessage} />
                    <RegisterForm onSubmit={this.onSubmit} />
                </div>
            </div>
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator
)(Register) as typeof Register;


