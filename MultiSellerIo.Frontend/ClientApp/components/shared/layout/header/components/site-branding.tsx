 import * as React from "react";

 export default class SiteBranding extends React.Component<{}, {}> {

    public render() {
        return <div className="site-branding">
            <div className="inner">
                <a className="offcanvas-toggle cats-toggle" href="#shop-categories" data-toggle="offcanvas"></a>
                <a className="offcanvas-toggle menu-toggle" href="#mobile-menu" data-toggle="offcanvas"></a>
                <a className="site-logo"><img src="/assets/images/GoodLook.png" alt="GoodLook" /></a>
            </div>
        </div>;
    }
}
