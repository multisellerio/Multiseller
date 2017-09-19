import { API_URL } from '../';
import { IProductMetaData } from '../../models/product-models';

export const ProductService = {

    getMetaData: async (): Promise<IProductMetaData> => {
        try {

            let response = await fetch(API_URL + 'products/meta',
                {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });

            let responseData = await response.json();

            if (response.status === 400) {
                throw new Error(responseData.error);
            }

            return responseData as IProductMetaData;

        } catch (err) {
            throw err;
        }
    }

}

