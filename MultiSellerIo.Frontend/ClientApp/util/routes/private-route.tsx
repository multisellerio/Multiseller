import * as React from "react";
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, RouteProps, withRouter } from "react-router-dom";
import { ApplicationState } from "../../store";

type RouteComponent = React.StatelessComponent<RouteComponentProps<{}>> | React.ComponentClass<any>

interface IAdditionalPrivateRouteProps {
    isAuthorize: boolean;
}

const PrivateRoute: React.StatelessComponent<RouteProps & IAdditionalPrivateRouteProps> = ({ component, isAuthorize, ...rest }) => {

    const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
        
        if (!component) {
            return null;
        }

        if (isAuthorize) {
            return <Component {...props}/>;
        }

        const redirectProps = {
            to: {
                pathname: "/account/login",
                state: { from: props.location },
            },
        }

        return <Redirect {...redirectProps}/>;
    }

    return <Route {...rest} render={renderFn(component)}/>;
}

function mapStateToProps(state: ApplicationState) {
    return {
        isAuthorize: state.account.isAuthorize
    };
}

export default withRouter(connect(mapStateToProps, null)(PrivateRoute) as React.ComponentType<RouteComponentProps<any>>) as typeof Route;