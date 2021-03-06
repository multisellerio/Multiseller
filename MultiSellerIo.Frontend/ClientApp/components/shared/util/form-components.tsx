﻿import * as React from "React";
import { WrappedFieldProps, Field, GenericField, FieldArray } from "redux-form";
import { Cascader, Select, InputNumber, Input } from "antd";

const Option = Select.Option;

export interface ISelectOption {
    name: string,
    value: string,
}

//INPUT COMPONENT

type TextInputProps = {
    hideLabel: boolean;
    label: string;
    col: string;
} & WrappedFieldProps;

export const InputComponent: React.StatelessComponent<TextInputProps> = (field: TextInputProps) => {

    const { input, label, col, hideLabel } = field;

    if (hideLabel) {
        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
            <Input {...input}/>
            {field.meta.touched &&
                field.meta.error &&
                <span className="form-control-feedback">{field.meta.error}</span>}
        </div>;
    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
            <label>{label}</label>
            <Input {...input}/>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

// PASSWORD COMPONENT

export const PasswordComponent: React.StatelessComponent<TextInputProps> = (field: TextInputProps) => {

    const { input, label, col, hideLabel } = field;

    if (hideLabel) {
        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
                   <Input type="password" {...input}/>
                   {field.meta.touched &&
                       field.meta.error &&
                       <span className="form-control-feedback">{field.meta.error}</span>}
               </div>;
    }

    return <div className={col}>
               <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
                   <label>{label}</label>
                   <Input type="password" {...input}/>
                   {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
               </div>
           </div>;
};

//INPUT NUMBER COMPONENT

type InputNumberProps = {
    hideLabel: boolean;
    label: string;
    col: string;
    formatter?: (value: number | string) => string;
    precision?: number;
} & WrappedFieldProps;

export const InputNumberComponent: React.StatelessComponent<InputNumberProps> = (field: InputNumberProps) => {

    const { input, label, col, hideLabel, formatter, precision } = field;

    if (hideLabel) {
        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
            <InputNumber {...input} formatter={formatter} precision={precision} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>;
    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
            <label>{label}</label><br/>
            <InputNumber {...input} formatter={formatter} precision={precision} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//TEXTAREA COMPONENT

type TextAreaProps = {
    hideLabel: boolean;
    label: string;
    col: string;
} & WrappedFieldProps;

export const TextAreaComponent: React.StatelessComponent<TextAreaProps> = (field: TextAreaProps) => {

    const { input, label, col } = field;
    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
            <label>{label}</label>
            <Input.TextArea {...input}/>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//SELECT COMPONENT

type SelectProps = {
    hideLabel: boolean;
    label: string;
    col: string;
    options: any;
} & WrappedFieldProps;

export const SelectComponent: React.StatelessComponent<SelectProps> = (field: SelectProps) => {

    const { input, label, options, col } = field;

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-danger" : "form-group"}>
            <label>{label}</label>
            <select className="form-control" {...input}>
                <option value="">Select {label}</option>
                {
                    options.map((option) => {
                        return <option value={option.value}>{option.name}</option>;
                    })
                }
            </select>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//SEARCHABLE COMPONENT

type SelectCascaderProps = {
    hideLabel: boolean;
    label: string;
    col: string;
    options: any;
} & WrappedFieldProps;

export const SelectCascader: React.StatelessComponent<SelectCascaderProps> = (field: SelectCascaderProps) => {

    let cascader = null;

    const { input, label, options, col } = field;

    const onPopupVisibleChange = (value: boolean) => {
        if (value) {
            input.onFocus(undefined);
        } else {
            input.onBlur(undefined);
        }
    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-danger has-error" : "form-group"}>
            <label>{label}</label>
            <Cascader ref={(component) => cascader = component} showSearch={true} allowClear={true} options={options} onPopupVisibleChange={onPopupVisibleChange} onChange={input.onChange} value={input.value} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

// ANTD SELECT COMPONENT

type AntdSelectProps = {
    hideLabel: boolean;
    label: string;
    col: string;
    options: any;
    mode: "default" | "multiple" | "tags" | "combobox";
    componentStyle: React.CSSProperties;
    placeholder: string;
    filterOption: any;
    showSearch?: boolean;
    onSelectChange?: any;
} & WrappedFieldProps;

export const AntdSelectComponent: React.StatelessComponent<AntdSelectProps> = (field: AntdSelectProps) => {

    const { input, label, options, col, mode, hideLabel, componentStyle, placeholder, filterOption, onSelectChange } = field;

    let value = input.value;

    if (!value) {
        value = undefined;
    }

    let search: boolean = false;

    if (field.showSearch) {
        search = field.showSearch;
    }

    const selectOnChange = (value: any) => {

        if (mode === null) {
            input.onChange([value]);
        } else {
            input.onChange(value);
        }

        if (onSelectChange) {
            onSelectChange(value);
        }

    }

    if (hideLabel) {

        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
            <Select placeholder={placeholder} mode={mode}
                style={componentStyle}
                filterOption={filterOption}
                value={value}
                showSearch={search}
                onChange={(value) => { selectOnChange(value); }}>
                {
                    options.map((option, index) => {
                        return <Option key={index} title={option.name} value={option.value}>{option.child ? option.child : option.name}</Option>;
                    })
                }
            </Select>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>;

    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-danger has-error" : "form-group"}>
            <label>{label}</label>
            <Select placeholder={placeholder} mode={mode}
                    style={componentStyle}
                    filterOption={filterOption}
                    value={value}
                    showSearch={search}
                    onChange={(value) => { selectOnChange(value); }}>
                {
                    options.map((option, index) => {
                        return <Option key={index} title={option.name} value={option.value}>{option.child ? option.child : option.name}</Option>;
                    })
                }
            </Select>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

const InputField = Field as new () => GenericField<any>;
const InputArrayField = FieldArray as new () => any;

export { InputField as Field, InputArrayField as FieldArray }
