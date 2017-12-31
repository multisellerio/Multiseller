import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { CallBackMessageType } from '../../models/common-models';
import { DISPLAY_MESSAGE, IDisplayMessageAction } from "../../types/actions/common-actions";
import { AppThunkAction } from ".././";
import * as _ from 'lodash';

/*************************
 *** STORE
 *************************/

export interface IMessageState {
    message: string;
    type: CallBackMessageType;
    show: boolean;
}

export interface ICommonState {
    message: IMessageState;
}

/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction =
    IDisplayMessageAction
    | RouterAction;

export const actionCreator = {

};

/*************************
 *** REDUCERS
 *************************/

const unloadedState: ICommonState = {
    message: {
        message: null,
        type: 0,
        show: false
    }
}

export const reducer: Reducer<ICommonState> = (state: ICommonState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case DISPLAY_MESSAGE:
            var displayMessageAction = action as IDisplayMessageAction;
            return {
                ...state,
                message: {
                    message: displayMessageAction.payload.message,
                    type: displayMessageAction.payload.type,
                    show: true
                },
            }
    }

    return state || unloadedState;
};
