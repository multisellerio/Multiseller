
//Dev Env
//const api = 'http://good-look-dev-api.azurewebsites.net/';
//const cdn = 'http://good-look-dev.azureedge.net/images/';

//Local Env
const api = 'http://localhost:50564/';
const cdn = 'http://localhost:61334/assets/images/';

var currentToken: string = null;

export var API_URL = api + "api/";

export const ImageUploadUrl = api + "images/upload";

export const getImageAssets = (image: string, width?: number, height?: number) => {

    if (width === null || height === null) {
        return cdn + image;
    }

    return cdn + height + "/" + width + "/" + image;

};

export const setToken = (token: string) => {
    currentToken = token;
}

export const getToken = () => {
    return currentToken;
}

export const handleApiResponseError = async (response: Response) => {

    //Handle the internal server error
    if (response.status === 500) {
        const responseData = await response.json();
        throw new Error(responseData.error);
    }

    //Handle the 
    if (response.status === 400) {
        const responseData = await response.json();
        throw new Error(responseData.error);
    }

    //Unexpected issues
    if (response.status !== 200 && response.status !== 201) {
        throw new Error('Unexpected error, please try again');
    }

    //Todo other implementation

}