import * as React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

interface IReactImageUploadProps {
    style?: object,
    className?: string,
    onChange?: any,
    buttonClassName?: object,
    buttonStyles?: object,
    withPreview?: boolean,
    accept?: string,
    name?: string,
    withIcon?: boolean,
    buttonText?: string,
    withLabel?: boolean,
    label?: string,
    labelStyles?: object,
    labelClass?: string,
    imgExtension?: any,
    maxFileSize?: number,
    fileSizeError?: string,
    fileTypeError?: string,
    errorClass?: string,
    errorStyle?: object,
}

interface IImageUploadFile {
    picture: string,
}

interface IReactImageUploadState {
    pictures: IImageUploadFile[],
    notAcceptedFileType: any,
    notAcceptedFileSize: any,
}

interface IImageBoxProps {
    item: any,
    removeImage: any,
}


const SortableItem = SortableElement(({ item }) => {
    return (<div className="image-box">
        <div className="deleteImage">X</div>
        <img src={item.picture} alt="preview" />
    </div >);
});

const SortableList = SortableContainer(({ items }) => {
    return (
        <div className="images-container">
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} item={value} />
            ))}
        </div>
    );
});

class ReactImageUploadComponent extends React.Component<IReactImageUploadProps, IReactImageUploadState> {

    public static defaultProps: IReactImageUploadProps = {
        className: '',
        buttonClassName: {},
        buttonStyles: {},
        withPreview: false,
        accept: "accept=image/*",
        name: "",
        withIcon: true,
        buttonText: "Choose images",
        withLabel: true,
        label: "Max file size: 5mb, accepted: jpg|gif|png|gif",
        labelStyles: {},
        labelClass: "",
        imgExtension: ['.jpg', '.gif', '.png', '.gif'],
        maxFileSize: 5242880,
        fileSizeError: " file size is too big",
        fileTypeError: " is not supported file extension",
        errorClass: "",
        errorStyle: {},
        style: {}
    };

    inputElement: HTMLInputElement = null;

    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            notAcceptedFileType: [],
            notAcceptedFileSize: []
        };
        this.inputElement = null;
        this.onDropFile = this.onDropFile.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);
    }

	/*
	 On button click, trigger input file to open
	 */
    triggerFileUpload() {
        this.inputElement.click();
    }

	/*
	 Handle file validation
	 */
    onDropFile(e) {
        const files = e.target.files;
        // If callback giving, fire.
        if (typeof this.props.onChange === "function") {
            this.props.onChange(files);
        }
        // Iterate over all uploaded files
        for (let i = 0, f; f = files[i]; i++) {
            // Check for file extension
            if (!this.hasExtension(f.name)) {
                const newArray = this.state.notAcceptedFileType.slice();
                newArray.push(f.name);
                this.setState({ notAcceptedFileType: newArray });
                continue;
            }
            // Check for file size
            if (f.size > this.props.maxFileSize) {
                const newArray = this.state.notAcceptedFileSize.slice();
                newArray.push(f.name);
                this.setState({ notAcceptedFileSize: newArray });
                continue;
            }

            const reader = new FileReader();
            // Read the image via FileReader API and save image result in state.
            reader.onload = ((e) => {
                var sort = this.state.pictures.length + 1;
                if (this.state.pictures.indexOf({ picture: e.target.result }) === -1) {
                    const newArray = this.state.pictures.slice();
                    newArray.push({ picture: e.target.result });
                    this.setState({ pictures: newArray });
                }
            });
            reader.readAsDataURL(f);
        }
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            pictures: arrayMove(this.state.pictures, oldIndex, newIndex),
        });
    };

	/*
	 Render the upload icon
	 */
    renderIcon() {
        if (this.props.withIcon && this.state.pictures.length === 0) {
            return <div className="uploadIcon icon-upload" />;
        }
    }

	/*
	 Render label
	 */
    renderLabel() {
        if (this.props.withLabel) {
            return <p className={this.props.labelClass} style={this.props.labelStyles}>{this.props.label}</p>
        }
    }

	/*
	 Check file extension (onDropFile)
	 */
    hasExtension(fileName) {
        return (new RegExp('(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
    }

	/*
	 Remove the image from state
	 */
    removeImage(picture) {
        const filteredAry = this.state.pictures.filter((e) => e !== picture);
        this.setState({ pictures: filteredAry });
    }

	/*
	 Check if any errors && render
	 */
    renderErrors() {
        let notAccepted = '';
        if (this.state.notAcceptedFileType.length > 0) {
            notAccepted = this.state.notAcceptedFileType.map((error, index) => {
                return (
                    <div className={'errorMessage' + this.props.errorClass} key={index} style={this.props.errorStyle}>
                        * {error} {this.props.fileTypeError}
                    </div>
                )
            });
        }
        if (this.state.notAcceptedFileSize.length > 0) {
            notAccepted = this.state.notAcceptedFileSize.map((error, index) => {
                return (
                    <div className={'errorMessage' + this.props.errorClass} key={index} style={this.props.errorStyle}>
                        * {error} {this.props.fileSizeError}
                    </div>
                )
            });
        }
        return notAccepted;
    }

	/*
	 Render preview images
	 */
    renderPreview() {
        return <SortableList helperClass="sortable-item" items={this.state.pictures} onSortEnd={this.onSortEnd} axis="xy" />;
    }

    render() {
        return (
            <div className="fileUploader">
                <div className="fileContainer">
                    {this.renderPreview()}

                    {this.renderIcon()}
                    {this.renderLabel()}
                    <div className="errorsContainer">
                        {this.renderErrors()}
                    </div>
                    <button type="button"
                        className={"chooseFileButton " + this.props.buttonClassName}
                        style={this.props.buttonStyles}
                        onClick={this.triggerFileUpload}
                    >{this.props.buttonText}
                    </button>
                    <input
                        type="file"
                        ref={input => this.inputElement = input}
                        name={this.props.name}
                        multiple
                        onChange={this.onDropFile}
                        accept={this.props.accept}
                        className={this.props.className}
                    />

                </div>
            </div>
        )
    }
}


export default ReactImageUploadComponent;