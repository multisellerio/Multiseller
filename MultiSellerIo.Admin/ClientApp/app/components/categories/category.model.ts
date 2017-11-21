export class CategoryModel {
    id: number = 0;
    name: string = '';
    slug: string = '';
    meta: string = '';
    parentCategoryId: number = 0;
    categoryAttributes: CategoryAttributeModel[] = [];
}

export class CategoryAttributeModel {
    categoryId: number = 0;
    productAttributeId: number = 0;
    isRequired: boolean = false;
    isGroup: boolean = false;
    attributeType: number = 0;
}