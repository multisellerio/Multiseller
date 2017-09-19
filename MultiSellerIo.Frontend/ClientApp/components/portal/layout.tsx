import * as React from 'react';

export default class Layout extends React.Component<{}, {}> {
    public render() {
        return <div className="animated fadeIn container padding-bottom-3x mb-2">
            <div className="row">
                <div className="col-lg-3">
                    <aside className="user-info-wrapper">
                        <div className="user-cover">
                            <div className="info-label" data-toggle="tooltip" title="" data-original-title="You currently have 290 Reward Points to spend"><i className="icon-medal"></i>290 points</div>
                        </div>
                        <div className="user-info">
                            <div className="user-avatar"><a className="edit-avatar" href="#"></a><img src="https://iepc2017.org/sites/default/files/default_images/default-image.jpg" alt="User" /></div>
                            <div className="user-data">
                                <h4>Daniel Adams</h4><span>Joined February 06, 2017</span>
                            </div>
                        </div>
                    </aside>
                    <nav className="list-group"><a className="list-group-item justify-content-between" href="account-orders.html"><span><i className="icon-bag"></i>Orders</span><span className="badge badge-primary badge-pill">6</span></a><a className="list-group-item" href="account-profile.html"><i className="icon-head"></i>Profile</a><a className="list-group-item active" href="account-address.html"><i className="icon-map"></i>Addresses</a><a className="list-group-item justify-content-between" href="account-wishlist.html"><span><i className="icon-heart"></i>Wishlist</span><span className="badge badge-primary badge-pill">3</span></a><a className="list-group-item justify-content-between" href="account-tickets.html"><span><i className="icon-tag"></i>My Tickets</span><span className="badge badge-primary badge-pill">4</span></a></nav>
                </div>
                <div className="col-lg-9">
                    <div className="portal-content-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>;
    }
}
