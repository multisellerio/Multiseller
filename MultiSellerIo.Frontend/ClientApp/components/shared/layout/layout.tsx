import * as React from "react";
import Footer from "./footer/footer";
import Header from "./header/header";
import TopBar from "./topbar/topbar";

import { connect } from 'react-redux';
import * as AccountState from "../../../store/account";
import { ApplicationState } from '../../../store';

import Message from "../common/message";

import { Alert, Button } from "antd";

type LayoutProps =
    AccountState.IAccountState & typeof AccountState.actionCreator;

class Layout extends React.Component<LayoutProps, {}> {

    constructor(props: LayoutProps) {
        super(props);
        this.logOff = this.logOff.bind(this);
        this.sendEmailConfirmation = this.sendEmailConfirmation.bind(this);
    }

    public componentWillMount(): void {
        this.props.getCurrentUser();
    }

    public logOff() {
        this.props.logOff();
    }

    public sendEmailConfirmation(): void {
        this.props.sendEmailConfirmation();
    }

    public render() {

        const { isAuthorize, user } = this.props;

        return <div>
            <TopBar />
            <Header logOff={this.logOff} isAuthorize={isAuthorize} username={user ? user.username : null} />
            <div className="offcanvas-wrapper">
                {this.props.user != null && !this.props.user.emailConfirmed && this.props.emailConfirmationRequestState.message == null && this.props.emailConfirmationState.message == null &&
                    <div className="container margin-bottom-1x">
                        <Alert type="warning" message="Email Not Yet Confirmed." description={<div><p>You have not yet confirmed your email address.</p><Button type="primary" loading={this.props.emailConfirmationRequestState.isLoading} onClick={this.sendEmailConfirmation}>Send Activation Mail</Button></div>} />
                    </div>
                }
                {this.props.user != null && !this.props.user.emailConfirmed && this.props.emailConfirmationRequestState.message != null && this.props.emailConfirmationState.message == null &&
                    <div className="container margin-bottom-1x">
                        <Alert type={this.props.emailConfirmationRequestState.success ? "success" : "error"} message={this.props.emailConfirmationRequestState.success ? "Success" : "Error"} description={this.props.emailConfirmationRequestState.message} />
                    </div>
                }
                {this.props.children}
                <Footer />
            </div>
            <Message />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
    null,
    { pure: false },
)(Layout);
