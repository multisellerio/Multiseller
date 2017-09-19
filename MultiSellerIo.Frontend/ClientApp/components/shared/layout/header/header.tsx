import * as React from 'react';
import SiteSearch from './components/site-search';
import SiteBranding from './components/site-branding';
import SiteMenu from './components/site-menu';
import ToolBar from './components/tool-bar';

interface IHeaderProps {
    isAuthorize: boolean,
    username: string,
    logOff(),
}

export default class Header extends React.Component<IHeaderProps, {}> {

    private siteSearch: any;

    public render() {

        const { isAuthorize, username, logOff } = this.props;

        return <header className="navbar navbar-sticky">
            <SiteSearch ref={(siteSearch) => { this.siteSearch = siteSearch} } />
            <SiteBranding />
            <SiteMenu />
            <ToolBar logOff={logOff} isAuthorize={isAuthorize} username={username} searchButtonClick={() => { this.siteSearch.toggle() }} />
        </header>;
    }
}