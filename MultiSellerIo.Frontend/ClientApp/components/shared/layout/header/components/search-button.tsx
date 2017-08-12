import * as React from 'react';

interface ISearchButtonProps {
    onClick: any;
}

export default class SearchButton extends React.Component<ISearchButtonProps, {}> {

    constructor(props: ISearchButtonProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!this.props.onClick) {
            return;
        }

        this.props.onClick();
    }

    public render() {
        return <div className="search" onClick={this.handleClick}><i className="icon-search"></i></div>;
    }
}
