import * as React from "React";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { parse } from 'qs';

import { Link } from 'react-router-dom';

import { RouteComponentProps } from 'react-router-dom';

import { Button, Spin, Breadcrumb, Select } from "antd";

import { ApplicationState } from "../../store";
import * as CatelogState from "../../store/catelog";
import * as ProductsState from "../../store/products";

import { IProductDetailsAttribute, IProductImage } from '../../models/product-models';

import { animateScroll } from 'react-scroll';

import ImageGallery from 'react-image-gallery';

import ProductUtil from '../../util/product/product-util';
import { numberToCurrency } from '../../util/common/currency';

import ReactRadioSelect from '../../util/components/radio-select/react-radio-select';
import { IReactRadioSelectItem } from '../../util/components/radio-select/react-radio-select';

import * as _ from 'lodash';

import * as Api from "../../api";

const ButtonGroup = Button.Group;
const Option = Select.Option;

interface IProductDetailssRouteProps {
    category: string;
    productslug: string;
    id: string;
}

interface IProductDetailsState {

}

type ProductsProps =
    CatelogState.ICatelogState
    & typeof CatelogState.actionCreator
    & ProductsState.IProductsState
    & typeof ProductsState.actionCreator
    & RouteComponentProps<IProductDetailssRouteProps>
class ProductDetails extends React.Component<ProductsProps, IProductDetailsState> {

    constructor(props: ProductsProps) {
        super(props);
        this.state = {

        }
    }

    componentWillMount(): void {
        if (this.props.currentProductDetailsData.product == null ||
            (this.props.currentProductDetailsData.product != null &&
                this.props.currentProductDetailsData.product.id !== Number(this.props.match.params.id))) {
            this.props.getProductDetails(Number(this.props.match.params.id));
        }
    }

    renderProductAttirbutes() {
        var allVariations = ProductUtil.getAllVariations(this.props.meta.metaData, this.props.currentProductDetailsData.product);

        return _.map(allVariations,
            (productDetailsAttribute: IProductDetailsAttribute) => {

                if (productDetailsAttribute.productAttribute.name.toLowerCase() === 'size') {

                    let options: IReactRadioSelectItem[] = _.map(productDetailsAttribute.values,
                        (value) => {
                            let attribute = value.values[0];
                            return { id: attribute.id, value: attribute.value, selected: false };
                        });

                    let onChange = (id: number) => {
                        alert(id);
                    }

                    return <div className="col-sm-12 p-1">
                        <p className="text-bold">{productDetailsAttribute.productAttribute.name} :</p>
                        <ReactRadioSelect options={options} onChange={onChange} />
                    </div>;
                }

                if (productDetailsAttribute.productAttribute.productAttributeValues.length !== 0) {

                    let options = _.map(productDetailsAttribute.values,
                        (value) => {
                            let attribute = value.values[0];
                            return <Option value={attribute.id}>{attribute.value}</Option>;
                        });

                    return <div className="col-sm-12 p-1">
                        <p className="text-bold">{productDetailsAttribute.productAttribute.name} :</p>
                        <Select className={"w-50"} placeholder={`Select ${productDetailsAttribute.productAttribute.name}`}>{options}</Select>
                    </div>;
                }

                return null;

            });
    }

    renderCategoryBreadCrumb() {

        var categories = ProductUtil.getCategory(this.props.currentProductDetailsData.product.categoryId,
            this.props.meta.metaData.categories);

        return <Breadcrumb>
            {_.map(categories,
                (categoryId) => {
                    var category = ProductUtil.getCategoryById(categoryId, this.props.meta.metaData);
                    return <Breadcrumb.Item><Link to={`/products/${category.slug}`}>{category.name}</Link></Breadcrumb.Item>;
                })}
        </Breadcrumb>;
    }

    public render() {

        if (this.props.currentProductDetailsData.product == null
            || (this.props.currentProductDetailsData.loading && this.props.currentProductDetailsData.error == null)) {
            return <div className="container padding-bottom-3x mb-1 text-center">
                <Spin size="large" />
            </div>;
        }

        if (!this.props.currentProductDetailsData.loading && this.props.currentProductDetailsData.error != null) {
            return <div className="container padding-bottom-3x mb-1 text-center">
                <Spin size="large" />
            </div>;
        }


        let images = _.map(this.props.currentProductDetailsData.product.images,
            (image: IProductImage) => {
                var url = Api.getImageAssets(image.name, 600, null);
                var thumbUrl = Api.getImageAssets(image.name, 100, null);
                return {
                    original: url,
                    thumbnail: thumbUrl
                }
            });

        return <div className="container padding-bottom-3x mb-1">
            <div className="row">
                <div className="col-md-12">
                    {this.renderCategoryBreadCrumb()}
                </div>
            </div>
            <div className="row margin-top-1x">
                <div className="col-md-6">
                    <div>
                        <ImageGallery items={images} thumbnailPosition={"left"} showFullscreenButton={false}
                            showPlayButton={false} disableArrowKeys={true} disableSwipe={true} showNav={false} />
                    </div>
                </div>
                <div className="col-md-6">
                    <h4 className="text-normal">{this.props.currentProductDetailsData.product.title}</h4><span className="h5 d-block">
                        {numberToCurrency(this.props.currentProductDetailsData.product.productVariants[0].price)}</span>
                    <p>{this.props.currentProductDetailsData.product.description}</p>
                    <hr className="mb-3" />
                    <div className="margin-top-1x margin-bottom-1x">
                        {this.renderProductAttirbutes()}
                    </div>
                    <hr className="mb-1" />
                    <div className="d-flex flex-wrap justify-content-between">
                        <div className="entry-share mt-2 mb-2"><span className="text-muted">Share:</span>
                            <div className="share-links"><a className="social-button shape-circle sb-facebook" href="#" data-toggle="tooltip" data-placement="top" title="Facebook"><i className="socicon-facebook"></i></a><a className="social-button shape-circle sb-twitter" href="#" data-toggle="tooltip" data-placement="top" title="Twitter"><i className="socicon-twitter"></i></a><a className="social-button shape-circle sb-instagram" href="#" data-toggle="tooltip" data-placement="top" title="Instagram"><i className="socicon-instagram"></i></a><a className="social-button shape-circle sb-google-plus" href="#" data-toggle="tooltip" data-placement="top" title="Google +"><i className="socicon-googleplus"></i></a></div>
                        </div>
                        <div className="sp-buttons mt-2 mb-2">
                            <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                            <button className="btn btn-primary" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!"><i className="icon-bag"></i> Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    ...state.catelog, ...state.products
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    ...CatelogState.actionCreator,
    ...ProductsState.actionCreator,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetails);
