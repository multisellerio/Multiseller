import * as React from 'react';
import TopBar from './topbar/topbar';
import Header from './header/header';

export default class Layout extends React.Component<{}, {}> {
    public render() {
        return <div>
            <TopBar />
            <Header />
            <div className="offcanvas-wrapper">
                {this.props.children}
            </div>
        </div>;
    }
}
