 import * as PropTypes from "prop-types";
 import * as React from "react";
 import { Link, LinkProps, matchPath } from "react-router-dom";

 interface INavLinkProps extends LinkProps {
    activeClassName?: string;
    exact?: boolean;
}

 export default class ListNavLink extends React.Component<INavLinkProps, {}> {

    public static contextTypes = {
        router: PropTypes.object,
    };

    public render() {

        const { router } = this.context;

        const { to, exact, ...rest } = this.props;

        const match = matchPath(router.route.location.pathname, to);
        const isActive = match != null && (!exact || match.isExact === exact);

        return (<li className={isActive ? "active" : ""}>
            <Link to={to} {...rest} />
        </li>);
    }

}
