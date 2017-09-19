import * as React from 'React';
import { connect } from 'react-redux';
import { reduxForm, Field, FormProps, FormErrors } from 'redux-form';
import ImageUploader from '../../../shared/util/react-image-upload';

import { ApplicationState } from '../../../../store';
import * as ProductState from '../../../../store/products';

import { InputComponent, TextAreaComponent, SelectComponent } from '../../../shared/util/form-components';
import { Alert } from '../../../shared/util/alert';

interface IProductFormData {
    title: string,
    description: string,
    category: number,
    vendor: string,
    images: string[],
}

interface IProductFormProps extends FormProps<IProductFormData, {}, {}> {
    onSubmit: any,
    handleSubmit?: any,
}

interface IProductFormState {
    files : any;
}

const ErrorMessageComponent = error => {
    const { message } = error;

    if (!message)
        return null;

    return <Alert message={message} title="Error" type="alert-danger" />;

}

@reduxForm<IProductFormData, {}, {}>({
    form: 'product-form',
    validate: ProductForm.validate,
})
class ProductForm extends React.Component<IProductFormProps, IProductFormState> {

    constructor(props: IProductFormProps) {
        super(props);
        this.state = {
            files : []
        }
        this.onDrop = this.onDrop.bind(this);
    }

    genderOptions = [
        { name: 'Male', value: 1 },
        { name: 'Female', value: 2 },
        { name: 'Unspecifed', value: 3 }
    ];

    static validate(values: IProductFormData) {
        let errors: FormErrors<IProductFormProps> = {};

        if (!values.title) {
            errors.title = 'Title is required';
        }

       
        return errors;
    }

    onDrop(picture) {
        this.setState({
            files: this.state.files.concat(picture)
        });
    }

    public render() {

        const { handleSubmit } = this.props;

        return <form onSubmit={handleSubmit}>

            <div className="card">
                <div className="card-block row">
                    <Field name="category" component={SelectComponent} label="Category" options={this.genderOptions} col="col-md-6" />
                    <Field name="vendor" component={InputComponent} label="Vendor" col="col-md-6" />
                    <Field type="text" name="title" component={InputComponent} label="Title" col="col-md-12" />
                    <Field name="description" rows="4" cols="50" component={TextAreaComponent} label="Description" col="col-md-12" />
                </div>
            </div>

            <br/>

            <div className="card">
                <div className="card-block row">
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                </div>
            </div>
           
           
            <div className="col-md-12">
                <button className="btn btn-primary margin-bottom-none submit-button" type="submit">Submit</button>
            </div>
        </form>;
    }

}

type AddProductProps =
    ProductState.IProductsState
    & typeof ProductState.actionCreator;
class AddProductComponents extends React.Component<AddProductProps, {}> {

    componentWillMount(): void {
        this.props.getMetaData();
    }

    private onSubmit(product: any) {
       
    }

    public render() {
        return <div>
                   <h4>Add Product</h4>
                   <hr className="padding-bottom-1x"/>
                   <ProductForm onSubmit={this.onSubmit}/>

               </div>;
    }

}

export default connect(
    (state: ApplicationState) => state.products,
    ProductState.actionCreator
)(AddProductComponents) as typeof AddProductComponents;
