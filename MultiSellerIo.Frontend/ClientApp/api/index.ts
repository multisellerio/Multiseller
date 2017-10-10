const ApiHost = "http://localhost:50564/";

export const API_URL = ApiHost + "api/";

export const ImageUploadUrl = ApiHost + "images/upload";

export const getImageAssets = (image: string, width?: number, height?: number) => {

    if (width === null || height === null) {
        return "/assets/images/" + image;
    }

    return "/assets/images/" + height + "/" + width + "/" + image;

};
