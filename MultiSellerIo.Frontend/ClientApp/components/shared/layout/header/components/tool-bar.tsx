 import * as React from "react";
 import AccountDropDown from "./account-drop-down";
 import CartDropDown from "./cart-drop-down";
 import SearchButton from "./search-button";

 interface IToolBarProps {
    searchButtonClick: any;
    isAuthorize: boolean;
    username: string;
    logOff();
}

 export default class ToolBar extends React.Component<IToolBarProps, {}> {

    constructor(props: IToolBarProps) {
        super(props);
        this.searchButtonClick = this.searchButtonClick.bind(this);
    }

    private searchButtonClick() {
        if (!this.props.searchButtonClick) {
            return;
        }
        this.props.searchButtonClick();
    }

    public render() {
        return <div className="toolbar">
            <div className="inner">
                <div className="tools">
                    <SearchButton onClick={this.searchButtonClick} />
                    <AccountDropDown logOff={this.props.logOff} isAuthorize={this.props.isAuthorize} username={this.props.username} />
                    <CartDropDown isAuthorize={this.props.isAuthorize} />
                </div>
            </div>
        </div>;
    }
}
