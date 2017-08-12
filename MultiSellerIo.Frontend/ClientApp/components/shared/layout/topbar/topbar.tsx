import * as React from 'react';

export default class TopBar extends React.Component<{}, {}> {

    public render() {
        return  <div className="topbar">
                    <div className="topbar-column">
                        <a className="hidden-md-down" href="mailto:support@unishop.com">
                            <i className="icon-mail"></i>&nbsp; support@unishop.com
                        </a>
                        <a className="hidden-md-down" href="tel:00331697720"><i className="icon-bell">
                            </i>&nbsp; 00 33 169 7720
                        </a>
                        <a className="social-button sb-facebook shape-none sb-dark" href="#" target="_blank">
                            <i className="socicon-facebook"></i>
                        </a>
                        <a className="social-button sb-twitter shape-none sb-dark" href="#" target="_blank">
                            <i className="socicon-twitter"></i>
                        </a>
                        <a className="social-button sb-instagram shape-none sb-dark" href="#" target="_blank">
                            <i className="socicon-instagram"></i>
                        </a>
                        <a className="social-button sb-pinterest shape-none sb-dark" href="#" target="_blank">
                            <i className="socicon-pinterest"></i>
                        </a>
                    </div>
                    <div className="topbar-column"><a className="hidden-md-down" href="#"><i className="icon-download">
                        </i>&nbsp; Get mobile app</a>
                    </div>
                </div>;
    }

}