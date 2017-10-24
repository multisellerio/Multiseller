import { Cookies } from '../util/cookies';
import { ApplicationState } from "./../store";
const ApiHost = "http://localhost:50564/";

let currentToken = null;

export const API_URL = ApiHost + "api/";

export const ImageUploadUrl = ApiHost + "images/upload";

export const getImageAssets = (image: string, width?: number, height?: number) => {

    if (width === null || height === null) {
        return "/assets/images/" + image;
    }

    return "/assets/images/" + height + "/" + width + "/" + image;

};

export const setToken = (token: string) => {
    currentToken = token;
}

export const getToken = () => {
    return currentToken;
}
