import { Action } from "redux";
import { ICallBackMessage } from "../../models/common-models";

export const DISPLAY_MESSAGE: string = "DISPLAY_MESSAGE";

/*************************
 *** MESSAGE ACTIONS
 *************************/

export interface IDisplayMessageAction extends Action {
    type: typeof DISPLAY_MESSAGE,
    payload: ICallBackMessage,
}