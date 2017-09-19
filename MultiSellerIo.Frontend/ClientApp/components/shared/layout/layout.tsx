import * as React from 'react';
import TopBar from './topbar/topbar';
import Header from './header/header';
import Footer from './footer/footer';

import { connect } from 'react-redux';

import { ApplicationState } from '../../../store';
import * as AccountState from '../../../store/account';

type LayoutProps =
    AccountState.IAccountState & typeof AccountState.actionCreator;

class Layout extends React.Component<LayoutProps, {}> {

    constructor(props: LayoutProps) {
        super(props);
        this.logOff = this.logOff.bind(this);
    }

    componentWillMount(): void {
        this.props.getCurrentUser();
    }

    logOff() {
        this.props.logOff();
    }

    public render() {

        const { isAuthorize, user } = this.props;

        return <div>
            <TopBar />
            <Header logOff={this.logOff} isAuthorize={isAuthorize} username={user ? user.username : null} />
            <div className="offcanvas-wrapper">
                {this.props.children}
                <Footer/>
            </div>

        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator,
    null,
    { pure: false }
)(Layout);
