export interface IStoreModel {
    storeName: string;
    shippingInformation: string;
    paymentAndRefundPolicies: string;
    verified: boolean;
    shippingCosts: IShippingCostModel[];
}

export interface IShippingCostModel {
    id: number;
    cityId?: number;
    countryId?: number;
    stateId?: number;
    cost: number;
    shippingCostType: ShippingCostType;
}

export enum ShippingCostType {
    Invalid = 0,
    Flat = 1,
    Country = 2,
    City = 3,
    AdditionalItem = 999
}