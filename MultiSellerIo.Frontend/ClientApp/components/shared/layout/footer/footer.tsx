import * as React from 'react';

export default class Footer extends React.Component<{}, {}> {

    public render() {

        return <div className="site-footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        <section className="widget widget-light-skin">
                            <h3 className="widget-title">Get In Touch With Us</h3>
                            <p className="text-white">Phone: 00 33 169 7720</p>
                            <ul className="list-unstyled text-sm text-white">
                                <li><span className="opacity-50">Monday-Friday:</span>9.00 am - 8.00 pm</li>
                                <li><span className="opacity-50">Saturday:</span>10.00 am - 6.00 pm</li>
                            </ul>
                            <p><a className="navi-link-light" href="#">support@goodlook.lk</a>
                            </p><a className="social-button shape-circle sb-facebook sb-light-skin" href="#"><i className="socicon-facebook"></i></a><a className="social-button shape-circle sb-twitter sb-light-skin" href="#"><i className="socicon-twitter"></i></a><a className="social-button shape-circle sb-instagram sb-light-skin" href="#"><i className="socicon-instagram"></i></a><a className="social-button shape-circle sb-google-plus sb-light-skin" href="#"><i className="socicon-googleplus"></i></a>
                        </section>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <section className="widget widget-light-skin">
                            <h3 className="widget-title">Our Mobile App</h3><a className="market-button apple-button mb-light-skin" href="#"><span className="mb-subtitle">Download on the</span><span className="mb-title">App Store</span></a><a className="market-button google-button mb-light-skin" href="#"><span className="mb-subtitle">Download on the</span><span className="mb-title">Google Play</span></a><a className="market-button windows-button mb-light-skin" href="#"><span className="mb-subtitle">Download on the</span><span className="mb-title">Windows Store</span></a>
                        </section>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <section className="widget widget-links widget-light-skin">
                            <h3 className="widget-title">About Us</h3>
                            <ul>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">About Unishop</a></li>
                                <li><a href="#">Our Story</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Our Blog</a></li>
                            </ul>
                        </section>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <section className="widget widget-links widget-light-skin">
                            <h3 className="widget-title">Account &amp; Shipping Info</h3>
                            <ul>
                                <li><a href="#">Your Account</a></li>
                                <li><a href="#">Shipping Rates & Policies</a></li>
                                <li><a href="#">Refunds & Replacements</a></li>
                                <li><a href="#">Taxes</a></li>
                                <li><a href="#">Delivery Info</a></li>
                                <li><a href="#">Affiliate Program</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
                <hr className="hr-light mt-2 margin-bottom-2x" />
                <div className="row">
                    <div className="col-md-7 padding-bottom-1x">
                        <div className="margin-bottom-1x"><img src="img/payment_methods.png" alt="Payment Methods" />
                        </div>
                    </div>
                </div>
                <p className="footer-copyright">© All rights reserved.</p>
            </div>
        </div>;
    }
}