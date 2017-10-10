 import * as React from "react";

 interface ISiteSearchState {
    showSearch: boolean;
    value: string;
}

 export default class SiteSearch extends React.Component<{}, ISiteSearchState> {

    constructor(props: any) {
        super(props);

        this.state = {
            showSearch: false,
            value: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.close = this.close.bind(this);
        this.clear = this.clear.bind(this);
    }

    public toggle() {

        const currentShowState = this.state.showSearch;

        this.setState({
            showSearch: !currentShowState,
        });

        this.clear();
    }

    private handleInputChange(event: any) {
        this.setState({ value : event.target.value });
    }

    private open() {
        this.setState({
            showSearch: true,
        });
    }

    private close() {
        this.setState({
            showSearch: false,
        });
    }

    private clear() {
        this.setState({
            value : "",
        });
    }

    public render() {
        return <form className={ this.state.showSearch ? "site-search search-visible" : "site-search" } method="get">
                   <input type="text" name="site_search" placeholder="Type to search..." onChange={this.handleInputChange} value={this.state.value} />
                   <div className="search-tools"><span className="clear-search" onClick={this.clear}>Clear</span><span onClick={this.close} className="close-search"><i className="icon-cross"></i></span></div>
               </form>;
    }
}
