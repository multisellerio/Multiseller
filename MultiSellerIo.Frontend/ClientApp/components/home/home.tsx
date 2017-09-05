import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as AccountState from '../../store/account';

import { RouteComponentProps } from 'react-router-dom';

type HomeProps =
    AccountState.IAccountState & typeof AccountState.actionCreator;
class Home extends React.Component<HomeProps, {}> {

    constructor(props: HomeProps) {
        super(props);
    }

    componentWillMount(): void {
        this.props.getCurrentUser();
    }

    public render() {

        if (!this.props.user) {
            return <div>
                <h1>Welcome GoodLook.lk</h1>
            </div>;
        }

        return <div>
            <h1>Hello, {this.props.user.username}!</h1>
        </div>;

    }
}

export default connect(
    (state: ApplicationState) => state.account,
    AccountState.actionCreator
)(Home) as typeof Home;
