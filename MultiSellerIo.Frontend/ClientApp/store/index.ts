import * as Account from "./account";
import * as Products from "./products";
import * as Catelog from "./catelog";
import * as Settings from "./settings";
import * as Common from "./common";

// The top-level state object
export interface ApplicationState {
    account: Account.IAccountState;
    products: Products.IProductsState;
    catelog: Catelog.ICatelogState;
    settings: Settings.ISettingsState;
    common: Common.ICommonState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    account: Account.reducer,
    products: Products.reducer,
    catelog: Catelog.reducer,
    settings: Settings.reducer,
    common: Common.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type AppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => ApplicationState) => void;
