import * as React from "React";
import * as _ from "lodash";

export interface IReactRadioSelectItem {
    id: number;
    value: string;
    selected: boolean;
}

interface IReactRadioSelectProps {
    options: IReactRadioSelectItem[],
    onChange?(id: number),
}

interface IReactRadioState {
    selectdItem?: number;
}

class ReactRadioSelect extends React.Component<IReactRadioSelectProps, IReactRadioState> {

    constructor(props: IReactRadioSelectProps) {
        super(props);
        let selectedItem = _.find(this.props.options, { selected: true });
        this.state = {
            selectdItem: selectedItem != null ? selectedItem.id : null
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick(id: number) {
        this.setState({
            selectdItem: id
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.selectdItem);
            }
        });
    }

    public render() {
        return <div className="radio-select">
            {_.map(this.props.options, (option: IReactRadioSelectItem) => {
                let selectClassName = option.id == this.state.selectdItem ? 'radio-select-item selected' : 'radio-select-item';
                return <div className={selectClassName} onClick={() => this.onClick(option.id)}>
                    <p>{option.value}</p>
                </div>;
            })}
        </div>;
    }
}

export default ReactRadioSelect;