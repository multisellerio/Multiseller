import { actionCreator as ProductActionCreator } from './store/products';

export const onProductLoad = (nextState) => {
    ProductActionCreator.getProduct(Number(nextState.params.id));
}
