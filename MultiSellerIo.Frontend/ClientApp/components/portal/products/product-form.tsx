import * as React from "React";
import { FormErrors, reduxForm, InjectedFormProps, arrayPush, arrayRemoveAll } from "redux-form";

import {
    IProductCategory, IProductMetaData, ICategoryAttribute,
    CategoryAttributeType, IProductAttributeValue
} from "../../../models/product-models";

import { Button, Icon, Modal, Upload, Avatar, Popconfirm, Badge, Alert } from "antd";
import {
    AntdSelectComponent, InputComponent,
    SelectCascader, TextAreaComponent, InputNumberComponent, Field, FieldArray
} from "../../shared/util/form-components";

import * as Api from "../../../api";

import * as _ from "lodash";

export interface IProductFormData {
    id: number;
    title: string;
    description: string;
    category: number[];
    vendor: string;
    images: IProductImage[];
    productVariants: IProductVairation[];
}

export interface IProductImage {
    id: number,
    name: string,
}

interface IProductFormProps extends InjectedFormProps<IProductFormData, {}> {
}

interface IAdditionalFormProps {
    metaData: IProductMetaData;
    dispatch: any;
    loading: boolean;
    editing: boolean;
}

interface IReduxFormProps {
    change: any;
    handleSubmit: any;
    submitting: boolean;
}

export interface IProductVairation {
    id: number,
    quantity: number,
    sku: string,
    upc: string,
    price: string,
    defaultImage: number,
    attributes: IProductVariationAttribute[],
}

export interface IProductVariationAttribute {
    attributeId: number,
    name: string,
    isGroup: boolean,
    values: number[],
}

interface IProductFormState {
    files: any;
    previewVisible: boolean;
    previewImage: string;
    categoryAttributes: ICategoryAttribute[],
    productVariations: IProductVairation[],
}

//Todo change the types

interface IProductVariantFieldArray {
    files: any;
    change: any;
    variantCategories: any;
    fields: any;
    meta: any;
}

//Todo change the types

interface IFieldImageArraryProps {
    fields: any;
    meta: any;
    change: any;
}

const renderProductVariant: React.StatelessComponent<IProductVariantFieldArray> = (fieldArray: IProductVariantFieldArray) => {

    const { fields, variantCategories, change, files } = fieldArray;

    return <div>

        {(fieldArray.meta.submitFailed && fieldArray.meta.error) && <div className="margin-bottom-1x">
            <Alert
                message="Error"
                description={fieldArray.meta.error}
                type="error"
                showIcon
            />
        </div>}

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

                        let options;

                        if (categoryAttribute.productAttribute.meta != null &&
                            categoryAttribute.productAttribute.meta.component === 'color') {

                            let valueName = categoryAttribute.productAttribute.meta.valueName;

                            options = _.map(categoryAttribute.productAttribute.productAttributeValues,
                                (productAttributeValue: IProductAttributeValue) => {
                                    let color = productAttributeValue.meta[valueName];
                                    let value = productAttributeValue.value;
                                    return {
                                        name: value,
                                        child: <div className="select-color-option"><Badge dot={true} style={{ backgroundColor: color, boxShadow: `${color} 0px 0px 0px 14px inset` }}></Badge><span className="color-name">{value}</span></div>,
                                        value: productAttributeValue.id
                                    }
                                });

                        } else {

                            options = _.map(categoryAttribute.productAttribute.productAttributeValues, (productAttributeValue: IProductAttributeValue) => {
                                return {
                                    name: productAttributeValue.value,
                                    value: productAttributeValue.id
                                }
                            });
                        }

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
                                filterOption={(value, option) => {
                                    return option.props.title && option.props.title.toLowerCase().includes(value.toLowerCase());
                                }}
                                hideLabel={true}
                                placeholder={`Select ${labelName}`}
                                name={`${variant}.attributes[${index}].values`}
                                mode={categoryAttribute.isGroup ? "multiple" : null}
                                options={options}
                                componentStyle={{ width: !categoryAttribute.isGroup ? '50px' : '200px' }}
                            />
                        </td>;
                    }));

                    const imageOptions = _.filter(_.map(files,
                        (image) => {

                            if (image.response == null) {
                                return null;
                            }

                            let fileName = image.response.fileList[0];
                            let imageUrl = Api.getImageAssets(fileName, 200, 200);
                            return {
                                value: fileName,
                                name: <Avatar className="image-select-option" src={imageUrl}></Avatar>
                            }
                        }), (option) => option != null);

                    return <tr key={index}>
                        <td>
                            <Field name={`${variant}.defaultImage`} component={AntdSelectComponent} hideLabel={true} options={imageOptions} />
                        </td>
                        {attributes}
                        <td>
                            <Field name={`${variant}.sku`} style={{ width: '70px' }} component={InputComponent} hideLabel={true} onFocus={(event) => event.target.select()} />
                        </td>
                        <td>
                            <Field style={{ width: '50px' }} precision={0} name={`${variant}.quantity`} min={0} component={InputNumberComponent} hideLabel={true} onFocus={(event) => event.target.select()} />
                        </td>
                        <td>
                            <Field style={{ width: '100px' }} precision={2} name={`${variant}.price`} min={0}
                                onFocus={(event) => event.target.select()}
                                component={InputNumberComponent}
                                formatter={value => { return `Rs. ${value && typeof value.replace === "function" ? value.replace(/\Rs.\s?|(,*)/g, '') : value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
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

const renderImages: React.StatelessComponent<IFieldImageArraryProps> = (fieldArray: IFieldImageArraryProps) => {

    const { fields, change } = fieldArray;

    return <div>

        {(fieldArray.meta.submitFailed && fieldArray.meta.error) &&
            <div className="margin-bottom-1x">
                <Alert
                    message="Error"
                    description={fieldArray.meta.error}
                    type="error"
                    showIcon />
            </div>
        }

        {
            fields.map((image, index) => {

                change(`images[${index}].id`, image.id);
                change(`images[${index}].name`, image.name);

                return <div>
                    <Field component="input" type="hidden" name={`images[${index}].id`} value={image.id} />
                    <Field component="input" type="hidden" name={`images[${index}].name`} value={image.name} />
                </div>;

            })
        }

    </div>;

}

class ProductForm extends React.Component<IProductFormProps & IAdditionalFormProps, IProductFormState> {

    constructor(props: IProductFormProps & IAdditionalFormProps) {
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

    public static validate(values: IProductFormData,  props: any) {

        const errors: FormErrors<IProductFormData, string> = {};

        if (!values.category) {
            errors.category = "Category is required";
        }

        if (!values.title) {
            errors.title = "Title is required";
        }

        if (!values.description) {
            errors.description = "Description is required";
        }


        if (values.productVariants != null && values.productVariants.length > 0) {

            errors.productVariants = [];

            let productVariationErrors = [];

            values.productVariants.forEach((productVariant: IProductVairation) => {

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

                productVariationErrors.push(productVariantError);

            });

            errors.productVariants = productVariationErrors;

        } else {
            errors.productVariants = { _error: "At least one variant must be entered" }
        }

        if (values.images == null || values.images.length === 0) {

            errors.images = { _error: "At least one image must be entered" }
        }

        return errors;
    }

    componentWillReceiveProps(props: IProductFormProps & IAdditionalFormProps): void {

        if (props.editing && props.initialValues && props.pristine) {
            console.log('initial the value of editing....');
            this.selectCategory(props.initialValues.category, props.initialValues.category);
            this.setState({
                files: _.map(props.initialValues.images, (image) => {
                    return {
                        uid: image.id,
                        id: image.id,
                        name: image.name,
                        status: 'done',
                        url: Api.getImageAssets(image.name, 200, 200),
                        response : {
                            fileList : [image.name]
                        }
                    }
                })
            });
        }
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

        this.props.dispatch(arrayRemoveAll('product-form', 'images'));

        _.map(this.state.files,
            (file) => {

                if (file.response && file.response.fileList && file.response.fileList[0] != null) {
                    this.props.dispatch(arrayPush('product-form', 'images', { id: file.id, name: file.response.fileList[0] }));
                }

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
                        <h6>Product Details</h6>
                        <br />
                        <div className="row">
                            <Field name="id" component="input" type="hidden" />
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
                                {this.props.error && <div className="margin-bottom-1x">
                                    <Alert
                                        message="Error"
                                        description={this.props.error}
                                        type="error"
                                        showIcon
                                    />
                                </div>}

                                <h6>Images</h6>
                                <br />
                                <FieldArray component={renderImages} name="images" change={this.props.change} />
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
                                <FieldArray component={renderProductVariant} files={this.state.files} name="productVariants" variantCategories={this.getAllVariantsCategoryAttributes()} change={this.props.change} />
                            </div>
                        }

                    </div>
                </div>


                <br />

                <div>
                    <Button type="primary" onClick={handleSubmit} loading={this.props.loading} >Submit</Button>
                    &nbsp;
                    <Button>Back to Portal</Button>
                </div>

            </form>
        </div>;
    }

    // Private functions

    private getAllVariantsCategoryAttributes(): ICategoryAttribute[] {

        let varientAttributes = _.filter(this.state.categoryAttributes, (categoryAttribute: ICategoryAttribute) => {
            return categoryAttribute.attributeType === CategoryAttributeType.Variant;
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

const form = reduxForm<IProductFormData, IProductFormProps & IAdditionalFormProps>({
    form: "product-form",
    validate: ProductForm.validate,
})(ProductForm);

export { form as ProductForm }
