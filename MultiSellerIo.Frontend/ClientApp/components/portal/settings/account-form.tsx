import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps } from "redux-form";

import { Button, Icon, Upload, Avatar } from "antd";
import { InputComponent, Field } from "../../shared/util/form-components";

import * as Api from "../../../api";

import * as _ from "lodash";

const formName: string = "account-form";

export interface IAccountFormData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    gender: number;
    id: number;
}


interface IAccountFormProps extends InjectedFormProps<IAccountFormData, {}> {
    dispatch?: any;
}

interface IAdditionalFormProps {
    loading: boolean;
    editing: boolean;
    saving: boolean;
}

interface IReduxFormProps {
    change: any;
    handleSubmit: any;
    submitting: boolean;
}

interface IAccountFormState {
    avatarSrc: string;
    uploading: boolean;
    error: boolean;
}

class AccountForm extends React.Component<IAccountFormProps & IAdditionalFormProps, IAccountFormState> {

    constructor(props: IAccountFormProps & IAdditionalFormProps) {
        super(props);
        this.state = {
            avatarSrc: null,
            uploading: false,
            error: false
        };
        this.uploadFileOnChange = this.uploadFileOnChange.bind(this);
    }

    public static validate(values: IAccountFormData, props: any): FormErrors<IAccountFormData> {
        const errors: FormErrors<IAccountFormData> = {};

        if (!values.username) {
            errors.username = "Username is required";
        }

        if (!values.email) {
            errors.email = "Email is required";
        }

        return errors;
    }

    componentWillMount(): void {
        if (this.props.initialValues) {
            this.setState({
                avatarSrc: Api.getImageAssets(this.props.initialValues.profileImage, 100, 100)
            });
        }
    }

    uploadFileOnChange(info) {
        if (info.file.status !== 'uploading') {
            this.setState({
                uploading: true,
                error: false
            });
        }
        if (info.file.status === 'done') {
            this.setState({
                uploading: false,
                avatarSrc: Api.getImageAssets(info.file.response.fileList[0], 100, 100),
                error: false
            });
            this.props.change('profileImage', info.file.response.fileList[0]);
        } else if (info.file.status === 'error') {
            this.setState({
                uploading: false,
                error: true
            });
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
                                    <Avatar src={this.state.avatarSrc} icon="user" size={"large"} className={"align-middle"} /> &nbsp;
                                    <Upload className={"align-middle"} action={Api.ImageUploadUrl} multiple={false} showUploadList={false} onChange={this.uploadFileOnChange}>
                                        <Button loading={this.state.uploading} size={"default"} type={"dashed"}>
                                            <Icon type="upload" /> Click to Upload
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <Field name="profileImage" component="input" type="hidden" />
                        <Field name="username" component={InputComponent} label="Username" col="col-md-12" />
                        <Field name="firstName" component={InputComponent} label="First Name" col="col-md-6" />
                        <Field name="lastName" component={InputComponent} label="Last Name" col="col-md-6" />
                        <Field name="email" component={InputComponent} label="Email" col="col-md-12" />
                    </div>

                    <div>
                        <Button type="primary" onClick={handleSubmit} loading={this.props.saving} >Save Changes</Button>
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
