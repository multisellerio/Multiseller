import * as React from 'react';
import SearchButton from './search-button';
import AccountDropDown from './account-drop-down';
import CartDropDown from './cart-drop-down';

interface IToolBarProps {
    searchButtonClick: any;
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
                    <AccountDropDown />
                    <CartDropDown />
                </div>
            </div>
        </div>;
    }
}