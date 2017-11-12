import * as React from "React";
import { connect } from "react-redux";
import { parse } from 'qs';
import { ApplicationState } from "../store";
import * as AccountState from "../store/account";
import { Spin, Alert } from "antd";
import { RouteComponentProps } from "react-router-dom";

interface IEmailConfirmProps {
}

type EmailConfirmProps = AccountState.IAccountState
    & typeof AccountState.actionCreator
    & RouteComponentProps<IEmailConfirmProps>;

class EmailConfirm extends React.Component<EmailConfirmProps, {}> {

    componentWillMount(): void {
        const query = parse(this.props.location.search.substr(1));
        if (this.props.emailConfirmationState.message == null) {
            this.props.confirmEmail({
                token: query.token,
                email: query.email
            });
        }
    }

    public render() {

        if (!this.props.emailConfirmationState.isLoading) {
            return <div className="container padding-bottom-2x mb-2 text-center">
                <Alert type={this.props.emailConfirmationState.success ? "success" : "error"} description={this.props.emailConfirmationState.message}
                    message={this.props.emailConfirmationState.success ? "Success" : "Error"} />
            </div>;
        }

        return <div className="container padding-bottom-3x mb-2 text-center">
            <Spin size="large" />
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
)(EmailConfirm) as typeof EmailConfirm;
