import * as React from 'React';

//INPUT COMPONENT

export const InputComponent = field => {
    const { input, label, type, col } = field;
    return <div className={col}>
               <div className={field.meta.touched && field.meta.error ? 'form-group has-danger' : 'form-group'}>
                   <label>{label}</label>
                   <input className="form-control" type={type} {...input} />
                   {field.meta.touched && field.meta.error && <span className="form-control-feedback">{field.meta.error}</span>}
               </div>
           </div>;
}

//SELECT COMPONENT

export const SelectComponent = field => {
    const { input, label, options, col } = field;
    return <div className={col}>
               <div className={field.meta.touched && field.meta.error ? 'form-group has-danger' : 'form-group'}>
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
}