export enum CallBackMessageType{
    Invalid = 0,
    Success = 1,
    Waring = 2,
    Error = 3
}

export interface ICallBackMessage {
    message: string;
    type: CallBackMessageType;
}
