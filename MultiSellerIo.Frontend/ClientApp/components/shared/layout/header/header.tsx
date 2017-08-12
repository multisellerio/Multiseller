import * as React from 'react';
import SiteSearch from './components/site-search';
import SiteBranding from './components/site-branding';
import SiteMenu from './components/site-menu';
import ToolBar from './components/tool-bar';


export default class Header extends React.Component<{}, {}> {

    private siteSearch: any;

    public render() {
        return <header className="navbar navbar-sticky">
            <SiteSearch ref={(siteSearch) => { this.siteSearch = siteSearch}} />
            <SiteBranding />
            <SiteMenu />
            <ToolBar searchButtonClick={() => { this.siteSearch.toggle() }} />
        </header>;
    }
}