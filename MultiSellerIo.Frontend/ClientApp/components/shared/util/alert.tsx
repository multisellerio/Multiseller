 import * as React from "React";

//ALERT

 export const Alert = (alert) => {
    const { type, title, message } = alert;
    const alertClass = "alert " + type + " fade show text-center margin-bottom-1x";
    return <div className={alertClass}>
        &nbsp;&nbsp;<strong>{title}</strong>&nbsp;&nbsp;
        {message}
    </div>;
};
