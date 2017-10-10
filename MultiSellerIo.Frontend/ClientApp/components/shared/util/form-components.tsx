import { Cascader, Select, InputNumber, Input } from "antd";
import * as React from "React";
import { CirclePicker } from "react-color";
const Option = Select.Option;

export interface ISelectOption {
    name: string,
    value: string,
}

//INPUT COMPONENT

export const InputComponent = (field) => {
    const { input, label, col, hideLabel } = field;

    if (hideLabel) {
        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
            <Input {...input} {...field} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>;
    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
            <label>{label}</label>
            <Input {...input} {...field} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//INPUT NUMBER COMPONENT
export const InputNumberComponent = (field) => {
    const { input, label, col, hideLabel } = field;

    if (hideLabel) {
        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
            <InputNumber {...input} {...field} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>;
    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
            <label>{label}</label>
            <InputNumber {...input} {...field} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//TEXTAREA COMPONENT
export const TextAreaComponent = (field) => {
    const { input, label, col } = field;
    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-error has-danger" : "form-group"}>
            <label>{label}</label>
            <Input.TextArea {...input} {...field}  />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//SELECT COMPONENT

export const SelectComponent = (field) => {
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
export const SelectCascader = (field) => {
    const { input, label, options, col } = field;
    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-danger has-error" : "form-group"}>
            <label>{label}</label>
            <Cascader options={options} {...input} />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

// ANTD SELECT COMPONENT
export const AntdSelectComponent = (field) => {

    const { input, label, options, col, mode, hideLabel, componentStyle, placeholder } = field;

    let value = input.value;

    if (!value || value == '') {
        value = undefined;
    }

    if (hideLabel) {

        return <div className={field.meta.touched && field.meta.error ? "has-error has-danger" : ""}>
            <Select placeholder={placeholder} mode={mode}
                style={componentStyle}
                value={value}
                onChange={(value) => { input.onChange(value); }}>
                {
                    options.map((option, index) => {
                        return <Option value={option.value}>{option.name}</Option>;
                    })
                }
            </Select>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>;

    }

    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-danger has-error" : "form-group"}>
            <label>{label}</label>
            <Select placeholder={placeholder} style={componentStyle} mode={mode} value={value} onChange={(value) => { input.onChange(value); }}>
                {
                    options.map((option, index) => {
                        return <Option value={option.value}>{option.name}</Option>;
                    })
                }
            </Select>
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};

//COLOR CIRCLE COMPONENT
export const ColorCircleComponent = (field) => {
    const { input, label, col, mode } = field;
    return <div className={col}>
        <div className={field.meta.touched && field.meta.error ? "form-group has-danger has-error" : "form-group"}>
            <label>{label}</label>
            <CirclePicker width="100%" />
            {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
        </div>
    </div>;
};
