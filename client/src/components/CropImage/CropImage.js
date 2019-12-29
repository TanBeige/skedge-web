import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

//Material UI
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Button from '@material-ui/core/Button'

/*
    //From react-image-crop documents, for Video Support: 
    -----
    Render a custom HTML element in place of an image. Useful if you want to support videos:

    const videoComponent = (
    <video autoPlay loop style={{ display: 'block', maxWidth: '100%' }}>
        <source src="sample.mp4" type="video/mp4" />
    </video>
    );

    <ReactCrop onChange={this.onCropChange} renderComponent={videoComponent} />;
    ----
*/


class CropImage extends Component {

    constructor(props) {
        super(props);

        let aspectRatio = 4/3;
        if(props.type === 'moment') {
          aspectRatio = 9/16
        }
        this.state = { 
            src: props.src,
            blob: null,
            crop: {
              unit: '%',
              width: 1000,
              aspect: aspectRatio,
            },
            percentCrop: null
        }
        this.submitCroppedImage = this.submitCroppedImage.bind(this)
    }

    componentDidUpdate(prevProps) {
        if(this.props.src !== prevProps.src) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
          this.setState({
              src: this.props.src
          })
        }
    } 

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
        reader.readAsDataURL(e.target.files[0]);
        }
    };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ 
      crop: crop ,
      percentCrop: percentCrop
    });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  submitCroppedImage() {
    this.props.cropSubmit(this.state.percentCrop);
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div style={{textAlign: 'center'}}>
        <GridContainer>
          {src && (
            <GridItem xs={12}>
              <ReactCrop
                src={src}
                style={{border: '2px solid black', borderRadius: 5}}
                imageStyle ={{maxHeight: '50vh', maxWidth: '80vw'}}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            </GridItem>
          )}
          {croppedImageUrl && (
            <GridItem xs={12}>
              <div style={{height: 160, width: 90, margin: 'auto', border: '2px solid black', borderRadius: 5}}>
                <img alt="Crop" style={{width: '100%', height: '100%'}} src={croppedImageUrl} />
              </div>
            </GridItem>
          )}
          <GridItem style={{margin: 12, height: '100%'}} xs={12}>
            <Button color='primary' style={{width:'100%'}} variant='outlined' onClick={this.submitCroppedImage}>Submit</Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default CropImage;