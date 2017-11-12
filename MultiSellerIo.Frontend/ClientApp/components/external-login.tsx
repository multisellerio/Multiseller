import * as React from "React";
import { connect } from "react-redux";
import { parse } from 'qs';
import { ApplicationState } from "../store";
import * as AccountState from "../store/account";
import { Spin } from "antd";
import { RouteComponentProps } from "react-router-dom";

interface IExternalLoginProps {
}

type ExternalLoginProps = AccountState.IAccountState
    & typeof AccountState.actionCreator
    & RouteComponentProps<IExternalLoginProps>;

class ExternalLogin extends React.Component<ExternalLoginProps, {}> {

    componentWillMount(): void {
        const query = parse(this.props.location.search.substr(1));
        this.props.setToken(query.token);
    }

    public render() {
        return <div className="container padding-bottom-2x mb-2 text-center">
            <Spin size="large" />
        </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
)(ExternalLogin) as typeof ExternalLogin;
