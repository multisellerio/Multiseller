import * as React from "React";

import { connect } from 'react-redux';
import * as CommonState from "../../../store/common";
import { ApplicationState } from '../../../store';

import { message } from "antd";
import { CallBackMessageType } from "../../../models/common-models";


type MessageProps =
    CommonState.ICommonState;
class Message extends React.Component<MessageProps, {}> {

    componentWillReceiveProps(nextProps: {readonly [P in "message"]: MessageProps[P]}, nextContext): void {
        if (nextProps.message) {

            let messageState = nextProps.message;

            if (messageState.type === CallBackMessageType.Success) {
                message.success(messageState.message, 5);
            }

            if (messageState.type === CallBackMessageType.Error) {
                message.error(messageState.message, 5);
            }

        }
    }

    public render() {
        return null;
    }

}

export default connect(
    (state: ApplicationState) => state.common,
    null
)(Message);