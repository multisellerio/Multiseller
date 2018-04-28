import * as React from "react";

export default class Footer extends React.Component<{}, {}> {

    public render() {

        return <footer className="site-footer">
            <div className="column text-center">
                <p className="text-sm mb-4">Need Support? Call<span className="text-primary">&nbsp;001 (917) 555-4836</span></p><a className="social-button sb-skype" href="#" data-toggle="tooltip" data-placement="top" title="Skype"><i className="socicon-skype"></i></a><a className="social-button sb-facebook" href="#" data-toggle="tooltip" data-placement="top" title="Facebook"><i className="socicon-facebook"></i></a><a className="social-button sb-google-plus" href="#" data-toggle="tooltip" data-placement="top" title="Google +"><i className="socicon-googleplus"></i></a><a className="social-button sb-twitter" href="#" data-toggle="tooltip" data-placement="top" title="Twitter"><i className="socicon-twitter"></i></a><a className="social-button sb-instagram" href="#" data-toggle="tooltip" data-placement="top" title="Instagram"><i className="socicon-instagram"></i></a>
                <p className="text-xxs text-muted mb-0 mt-3">© All rights reserved. GoodLook Pvt Ltd, 2018</p>
            </div>
            <div className="column">
                <h3 className="widget-title text-center">Subscription<small>To receive latest offers and discounts from the shop.</small></h3>

            </div>
            <div className="column">
                <h3 className="widget-title text-center">Payment Methods<small>We support one of the following payment methods.</small></h3>
                <div className="footer-cards"><img src="/assets/images/cards.png" alt="Payment Methods" />
                </div>
            </div>
        </footer>;
    }
}
