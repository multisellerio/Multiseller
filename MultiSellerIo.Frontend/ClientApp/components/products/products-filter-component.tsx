import * as React from "React";

import * as _ from 'lodash';

import { Slider, Checkbox, Button } from "antd";
import CircleColorPicker from "react-circle-color-picker";

interface IVendorItem {
    id: number;
    name: string;
    checked: boolean;
}

export interface IAttributeFilterItem {
    id: number;
    name: string;
    filterItems: IAttributeItem[];
}

export interface IAttributeItem {
    id: number;
    name: string;
    meta: any;
    checked: boolean;
}

export interface IProductFilterChangeEvent {
    vendors: string[],
    attributes: number[],
    maxPrice: number,
    minPrice: number,
}

interface IProductsFilterComponentProps {
    vendors: IVendorItem[];
    attributeFilters: IAttributeFilterItem[];
    maxPrice: number,
    minPrice: number,
    currentMaxPrice: number,
    currentMinPrice: number,
    onChange?: (event: IProductFilterChangeEvent) => void;
}

interface IProductsFilterState {
    vendors: IVendorItem[];
    attributeFilters: IAttributeFilterItem[];
    maxPrice: number,
    minPrice: number,
    currentMaxPrice: number,
    currentMinPrice: number,
}

export default class ProductsFilterComponent extends React.Component<IProductsFilterComponentProps, IProductsFilterState> {

    constructor(props: IProductsFilterComponentProps) {
        super(props);
        this.state = {
            vendors: this.props.vendors,
            attributeFilters: this.props.attributeFilters,
            maxPrice: this.props.maxPrice,
            minPrice: this.props.minPrice,
            currentMaxPrice: this.props.currentMaxPrice,
            currentMinPrice: this.props.currentMinPrice
        }
    }

    getAttributeValues(id: number) : number[] {

        let attributeFilter: IAttributeFilterItem = _.find(this.props.attributeFilters, { id: id });

        if (attributeFilter) {
            let values = _.filter(attributeFilter.filterItems, { checked: true });
            let valueIds: number[] = _.map(values, (attributeValue: IAttributeItem) => {
                return attributeValue.id;
            });
            return valueIds;
        }

        return [];
    }

    getVendors(): string[] {

        let vendors = _.filter(this.state.vendors, (vendorItem: IVendorItem) => {
            return vendorItem.checked;
        });

        return _.map(vendors, (vendorItem: IVendorItem) => {
            return vendorItem.name;
        });

    }

    onColorValueChange(id, values) {

        let attributeFilters = this.state.attributeFilters;

        let attribute: IAttributeFilterItem = _.find(attributeFilters, (attributeFilter: IAttributeFilterItem) => {
            return attributeFilter.id == id;
        });

        if (attribute) {

            _.each(attribute.filterItems, (filterItem: IAttributeItem) => {
                let checked = _.some(values, { id: filterItem.id, selected: true });
                filterItem.checked = checked;
            });

        }

        this.setState({
            attributeFilters: attributeFilters
        }, () => this.callToOnChange());

    }

    onAttributeValueChange(id: number, values: number[]) {

        let attributeFilters = this.state.attributeFilters;

        let attribute: IAttributeFilterItem = _.find(attributeFilters, (attributeFilter: IAttributeFilterItem) => {
            return attributeFilter.id == id;
        });
       
        if (attribute) {

            _.each(attribute.filterItems, (filterItem: IAttributeItem) => {
                let checked = _.includes(values, filterItem.id);
                filterItem.checked = checked;
            });

        }

        this.setState({
            attributeFilters: attributeFilters
        }, () => this.callToOnChange());

    }

    onVendorValueChange(values: string[]) {

        let vendros = this.state.vendors;

        _.each(vendros, (vendor: IVendorItem) => {
            let checked = _.includes(values, vendor.name);
            vendor.checked = checked;
        });

        this.setState({
            vendors: vendros
        }, () => this.callToOnChange());

    }

    onPriceChange(values: number | number[]) {
       
        this.setState({
            currentMinPrice: values[0],
            currentMaxPrice: values[1]
        });

    }

    callToOnChange() {

        if (!this.props.onChange) {
            return;
        }

        let vendors = _.map(_.filter(this.state.vendors, { checked: true }), (item) => {
            return item.name;
        });

        let attributeValues: number[] = [];

        _.map(this.state.attributeFilters, (attributeFilter) => {
            _.map(attributeFilter.filterItems, (filterItem) => {
                if (filterItem.checked) {
                    attributeValues.push(filterItem.id);
                }
            });
        });

        let event: IProductFilterChangeEvent = {
            vendors: vendors,
            attributes: attributeValues,
            maxPrice: this.state.currentMaxPrice,
            minPrice: this.state.currentMinPrice,
        }

        this.props.onChange(event);
    }

    public renderVendors() {

        let vendorsCheckbox = _.map(this.state.vendors,
            (vendor: IVendorItem) => {
                return <div key={vendor.name} className="d-block">
                    <Checkbox value={vendor.name}><b>{vendor.name}</b></Checkbox>
                </div>;
            });

        return <section className="widget">
            <h3 className="widget-title">Filter by Vendors</h3>
            <Checkbox.Group onChange={(values: string[]) => this.onVendorValueChange(values)} defaultValue={this.getVendors()}>
                {
                    vendorsCheckbox
                }
            </Checkbox.Group>
        </section>;

    }

    public renderAttributeFilters() {

        return _.map(this.state.attributeFilters,
            (attributeFilter: IAttributeFilterItem) => {

                if (attributeFilter.name.toLowerCase() === 'color') {

                    let colors = _.map(attributeFilter.filterItems,
                        (attributeItem: IAttributeItem) => {

                            return {
                                id: attributeItem.id,
                                hex: attributeItem.meta.colorValue,
                                selected: attributeItem.checked
                            }
                        });

                    return <section key={attributeFilter.id} className="widget">
                        <h3 className="widget-title">Filter by {attributeFilter.name}</h3>
                        <CircleColorPicker colors={colors} onChange={(value) => this.onColorValueChange(attributeFilter.id, value)} />
                    </section>;
                }

                let filterItems = _.map(attributeFilter.filterItems,
                    (filterItem: IAttributeItem) => {

                        return <div key={filterItem.id} className="d-block">
                            <Checkbox value={filterItem.id}><b>{filterItem.name}</b></Checkbox>
                        </div>;

                    });

                return <section key={attributeFilter.id} className="widget">
                    <h3 className="widget-title">Filter by {attributeFilter.name}</h3>
                    <Checkbox.Group defaultValue={this.getAttributeValues(attributeFilter.id)} onChange={(values: number[]) => this.onAttributeValueChange(attributeFilter.id, values)}>
                        {
                            filterItems
                        }
                    </Checkbox.Group>
                </section>;
            });
    }

    public render() {
        return <aside className="sidebar">
            <section className="widget widget-categories">
                <h3 className="widget-title">Price Range</h3>
                <div className="price-range-slider">
                    <div>
                        <Slider range max={this.state.maxPrice} min={this.state.minPrice} defaultValue={[this.state.currentMinPrice, this.state.currentMaxPrice]} step={100} onChange={(value) => this.onPriceChange(value)} />
                    </div>
                    <div className="ui-range-slider-footer">
                        <div className="column">
                            <Button type={"primary"} onClick={() => this.callToOnChange()}>Filter</Button>
                        </div>
                        <div className="column">
                            <div className="ui-range-values">
                                <div className="ui-range-value-min">Rs. {this.state.currentMinPrice}<span></span>
                                </div>&nbsp;-&nbsp;
                                       <div className="ui-range-value-max">Rs. {this.state.currentMaxPrice} <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {this.renderVendors()}

            {this.renderAttributeFilters()}

        </aside>;
    }
}