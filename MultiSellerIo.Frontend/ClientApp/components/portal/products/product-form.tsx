import * as React from "React";
import { Field, FormErrors, FormProps, reduxForm, FieldArray } from "redux-form";

import { IProductCategory, IProductMetaData, ICategoryAttribute,
    CategoryAttributeType, IProductAttributeValue
} from "../../../models/product-models";

import { Button, Icon, Modal, Upload, Avatar, Popconfirm } from "antd";
import { Alert } from "../../shared/util/alert";
import {
    AntdSelectComponent, InputComponent,
    SelectCascader, TextAreaComponent, ISelectOption, InputNumberComponent
} from "../../shared/util/form-components";

import * as Api from "../../../api";

import * as _ from "lodash";

interface IProductFormData {
    title: string;
    description: string;
    category: number;
    vendor: string;
    images: IProductImage[];
    productVariants: IProductVairation[];
}

interface IProductImage {
    id: number,
    url: string,
}

interface IProductFormProps extends FormProps<IProductFormData, {}, {}> {
    onSubmit: any;
    handleSubmit?: any;
    metaData: IProductMetaData;
    change: any,
}

interface IProductVairation {
    id: number,
    quantity: number,
    sku: string,
    upc: string,
    price: number,
    defaultImage: number,
    attributes: IProductVariationAttribute[],
}

interface IProductVariationAttribute {
    attributeId: number,
    name: string,
    isGroup: boolean,
    values: number[]
}


export interface IProductFormState {
    files: any;
    previewVisible: boolean;
    previewImage: string;
    categoryAttributes: ICategoryAttribute[],
    productVariations: IProductVairation[],
}

const ErrorMessageComponent = (error) => {
    const { message } = error;

    if (!message)
        return null;

    return <Alert message={message} title="Error" type="alert-danger" />;

};

const renderProductVariant = (fieldArray) => {

    const { fields, variantCategories, change, images } = fieldArray;

    return <div>

        <div className="margin-bottom-1x">
            <Button onClick={() => fields.push({ price: 0, quantity: 0 })}><Icon type="plus" />Add a variant product</Button>
        </div>

        <table className="table table-hover">

            <thead>
                <tr>
                    <th>Default Image</th>
                    {
                        _.map(variantCategories, ((categoryAttribute: ICategoryAttribute) => {
                            const labelName = `${categoryAttribute.productAttribute.name}${categoryAttribute.isGroup ? ' (S)' : ''}`;
                            return <th>{labelName}</th>;
                        }))
                    }
                    <th>Sku</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>

            {
                fields.map((variant, index) => {

                    const attributes = _.map(variantCategories, ((categoryAttribute: ICategoryAttribute, index: number) => {

                        const options: ISelectOption[] = _.map(categoryAttribute.productAttribute.productAttributeValues, (productAttributeValue: IProductAttributeValue) => {
                            return {
                                name: productAttributeValue.value,
                                value: productAttributeValue.id
                            }
                        });

                        const labelName = `${categoryAttribute.productAttribute.name}${categoryAttribute.isGroup ? ' (S)' : ''}`;

                        change(`${variant}.attributes[${index}].attributeId`, categoryAttribute.productAttribute.id);
                        change(`${variant}.attributes[${index}].name`, categoryAttribute.productAttribute.name);
                        change(`${variant}.attributes[${index}].isGroup`, categoryAttribute.isGroup);

                        return <td>
                            <Field component="input" type="hidden" name={`${variant}.attributes[${index}].attributeId`} value={categoryAttribute.productAttribute.id} />
                            <Field component="input" type="hidden" name={`${variant}.attributes[${index}].name`} value={categoryAttribute.productAttribute.name} />
                            <Field component="input" type="hidden" name={`${variant}.attributes[${index}].isGroup`} value={categoryAttribute.isGroup} />
                            <Field
                                component={AntdSelectComponent}
                                hideLabel={true}
                                placeholder={`Select ${labelName}`}
                                name={`${variant}.attributes[${index}].values`}
                                mode={categoryAttribute.isGroup ? "multiple" : null}
                                options={options}
                                componentStyle={{ width: !categoryAttribute.isGroup ? '100px' : '200px' }}
                            />
                        </td>;
                    }));

                    const imageOptions = _.map(images,
                        (image) => {
                            let fileName = image.response.fileList[0];
                            let imageUrl = Api.getImageAssets(fileName, 200, 200);
                            return {
                                value: fileName,
                                name: <Avatar className="image-select-option" src={imageUrl}></Avatar>
                            }
                        });

                    return <tr key={index}>
                        <td>
                            <Field name={`${variant}.defaultImage`} component={AntdSelectComponent} hideLabel={true} options={imageOptions} />
                        </td>
                        {attributes}
                        <td>
                            <Field name={`${variant}.sku`} component={InputComponent} hideLabel={true} onFocus={(event) => event.target.select()} />
                        </td>
                        <td>
                            <Field style={{ width: '100%' }} precision={0} name={`${variant}.quantity`} min={0} component={InputNumberComponent} hideLabel={true} onFocus={(event) => event.target.select()} />
                        </td>
                        <td>
                            <Field style={{ width: '100%' }} precision={2} name={`${variant}.price`} min={0}
                                onFocus={(event) => event.target.select()}
                                component={InputNumberComponent}
                                formatter={value => { return `Rs. ${value && typeof value.replace === "function" ? value.replace(/\Rs.\s?|(,*)/g, '') : '0'}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                                hideLabel={true} />
                        </td>
                        <td>
                            <Popconfirm placement="topRight" title="Are you sure delete this product variant?" okText="Delete" onConfirm={() => { fields.remove(index); }} cancelText="Cancel">
                                <Button icon="delete" size="large"></Button>
                            </Popconfirm>
                        </td>
                    </tr>;
                })
            }

        </table>
    </div>;


}

@reduxForm<IProductFormData, {}, {}>({
    form: "product-form",
    validate: ProductForm.validate,
})
export class ProductForm extends React.Component<IProductFormProps, IProductFormState> {

    constructor(props: IProductFormProps) {
        super(props);
        this.state = {
            files: [],
            previewVisible: false,
            previewImage: "",
            categoryAttributes: [],
            productVariations: [],
        };

        this.uploadHandleCancel = this.uploadHandleCancel.bind(this);
        this.uploadHandlePreview = this.uploadHandlePreview.bind(this);
        this.uploadHandleChange = this.uploadHandleChange.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
    }

    public static validate(values: IProductFormData) {

        const errors: FormErrors<IProductFormProps> = {};

        if (!values.category) {
            errors.category = "Category is required";
        }

        if (!values.title) {
            errors.title = "Title is required";
        }

        if (!values.description) {
            errors.description = "Description is required";
        }

        errors.productVariants = [];

        console.log(values.productVariants);

        if (values.productVariants != null) {

            values.productVariants.forEach((productVariant: IProductVairation, index: number) => {

                let productVariantError = {
                    price: null,
                    quantity: null,
                    attributes: []
                };

                if (!productVariant.price) {
                    productVariantError.price = "Price is required";
                }

                if (!productVariant.quantity) {
                    productVariantError.quantity = "Quantity is required";
                }

                if (productVariant.attributes != null) {

                    productVariant.attributes.forEach((productAttribute: IProductVariationAttribute) => {

                        let productAttributeError = {
                            values: null
                        };

                        if (!productAttribute.values) {
                            productAttributeError.values = `${productAttribute.name} is required`;
                        }

                        productVariantError.attributes.push(productAttributeError);

                    });

                }

                errors.productVariants.push(productVariantError);

            });

        }

        return errors;
    }

    public getCategoryOptions() {

        const self = this;

        if (!this.props.metaData || !this.props.metaData.categories)
            return [];

        return _.map(this.props.metaData.categories,
            (category) => {
                return self.getCategoryItem(category);
            });
    }

    public uploadHandleChange(response) {

        let file = response.file;
        file.id = 0;
        this.setState({
            files: response.fileList,
        });
    }

    public uploadHandlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    public uploadHandleCancel() {
        this.setState({
            previewVisible: false,
        });
    }

    public selectCategory(value, selectedOptions) {

        if (!selectedOptions || selectedOptions.length === 0) {
            return;
        }

        const selectedValue = selectedOptions[selectedOptions.length - 1];
        const attributes = this.getAttributes(selectedValue);

        this.setState({
            categoryAttributes: attributes,
        });
    }

    public render() {

        const { handleSubmit } = this.props;
        const { files, previewVisible, previewImage } = this.state;

        const categories = this.getCategoryOptions();

        const hiddenFileData = _.map(files, (file, index) => {

            if (file.response && file.response.fileList && file.response.fileList.length != 0) {

                this.props.change(`files[${index}].id`, file.id);
                this.props.change(`files[${index}].url`, file.response.fileList[0]);

                return <div>
                    <Field component="input" type="hidden" name={`files[${index}].id`} value={file.id} />
                    <Field component="input" type="hidden" name={`files[${index}].url`} value={file.response.fileList[0]} />
                </div>

            }

            return null;

        });

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return <div className="product-form">
            <form onSubmit={handleSubmit}>

                <div className="card">
                    <div className="card-block">
                        <h6>Product Variant</h6>
                        <br />
                        <div className="row">
                            <Field name="category" searchPromptText="Select category" showSearch={true} component={SelectCascader} label="Category" options={categories} onChange={this.selectCategory} col="col-md-6" />
                            <Field name="vendor" component={InputComponent} label="Vendor" col="col-md-6" />
                            <Field type="text" name="title" component={InputComponent} label="Title" col="col-md-12" />
                            <Field name="description" rows="4" cols="50" component={TextAreaComponent} label="Description" col="col-md-12" />
                        </div>
                    </div>
                </div>

                <br className="margin-bottom-1x" />

                <div className="card">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-md-12">
                                <h6>Images</h6>
                                <br />
                                <Upload
                                    action={Api.ImageUploadUrl}
                                    listType="picture-card"
                                    fileList={files}
                                    onPreview={this.uploadHandlePreview}
                                    onChange={this.uploadHandleChange}
                                >
                                    {uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.uploadHandleCancel}>
                                    <img alt="example" style={{ width: "100%" }} src={previewImage} />
                                </Modal>
                                {hiddenFileData}
                            </div>
                        </div>
                    </div>
                </div>

                <br className="margin-bottom-1x" />

                <div className="card">
                    <div className="card-block">
                        <h6>Product Variant</h6>

                        {this.state.categoryAttributes.length === 0 && <span> Select a category for product variations </span>}

                        {this.state.categoryAttributes.length !== 0 &&
                            <div>
                                <br />
                                <FieldArray name="productVariants" variantCategories={this.getAllVariantsCategoryAttributes()} images={this.state.files} change={this.props.change} component={renderProductVariant} />
                            </div>
                        }

                    </div>
                </div>


                <br />

                <div>
                    <br />
                    <button type="submit">Submit</button>
                </div>

            </form>
        </div>;
    }

    // Private functions

    private getAllVariantsCategoryAttributes(): ICategoryAttribute[] {

        let varientAttributes = _.filter(this.state.categoryAttributes, (categoryAttribute: ICategoryAttribute) => {
            return categoryAttribute.attributeType == CategoryAttributeType.Variant;
        });

        return varientAttributes;
    }

    private getValue(attributeId: number, value: number): string {

        let allCategoryAttributes = this.getAllVariantsCategoryAttributes();

        let attribute: ICategoryAttribute = _.find(allCategoryAttributes, {
            productAttribute: {
                id: attributeId
            }
        });

        if (!attribute) {
            return null;
        }

        let attributeValue: IProductAttributeValue = _.find(attribute.productAttribute.productAttributeValues, { id: value });

        if (!attributeValue) {
            return null;
        }

        return attributeValue.value;

    }

    private getCategoryItem(category: IProductCategory) {

        const self = this;

        const option = {
            value: category.id,
            label: category.name,
            children: [],
        };

        if (!category.children || category.children.length === 0) {
            return option;
        }

        option.children = _.map(category.children,
            (child) => {
                return self.getCategoryItem(child);
            });

        return option;
    }

    private getAllCategories(): IProductCategory[] {

        const self = this;

        if (!this.props.metaData || !this.props.metaData.categories) {
            return [];
        }

        let categories: IProductCategory[] = [];

        _.map(this.props.metaData.categories,
            (category: IProductCategory) => {
                categories = categories.concat([category, ...self.getChildCategoryItems(category)]);
            });

        return categories;
    }

    private getChildCategoryItems(category: IProductCategory): IProductCategory[] {

        const self = this;

        if (!category.children || category.children.length === 0) {
            return [];
        }

        let productCategories = [];

        _.map(category.children,
            (child) => {
                productCategories = productCategories.concat([child, ...self.getChildCategoryItems(child)]);
            });

        return productCategories;

    }

    private getAttributes(categoryId: number): ICategoryAttribute[] {

        const allCategories = this.getAllCategories();

        const category = _.find(allCategories, { id: categoryId });

        if (!category) {
            return [];
        }

        let attributes: ICategoryAttribute[] = [];

        let parentCategory: IProductCategory = category;

        do {
            _.map(parentCategory.categoryAttributes,
                (attribute: ICategoryAttribute) => {
                    attributes = [...attributes, attribute];
                });

            if (parentCategory.parentCategoryId == null) {
                break;
            }

            parentCategory = _.find(allCategories, { id: parentCategory.parentCategoryId });

        } while (true);

        return attributes;
    }

}