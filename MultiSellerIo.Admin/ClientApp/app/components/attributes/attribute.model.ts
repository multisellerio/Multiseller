export class AttributeModel {
    id: number = 0;
    name: string = '';
    description: string = '';
    meta: string = '';
    productAttributeValues: AttributeValueModel[] = [];
}

export class AttributeValueModel {
    id: number = 0;
    value: string = '';
    meta: string = '';
    productAttributeId: number = 0;
}