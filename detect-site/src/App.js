import { useState } from 'react';
import axios from 'axios';

import './styles/mystyles.css';
import carImg from './img/img51.jpg';

const App = () => {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');


    /* Using axios, get a response from the detect-api setup in Flask */
    const queryDetectApi = () => {
        const url = 'get-preds';
        // const url = 'draw-boxes'

        let formData = new FormData();
        formData.append('file', file)

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };

        axios.post(url, formData, config).then((response) => {
            // get the output image data, this is stored in a decoded 64bit hex/string
            let output_image = response.data['output_image'];

            // atob decodes output_image, which was encoded using base64 encoding
            // bytecharacters now contains ASCII string of the decoded data
            const byteCharacters = atob(output_image);

            // use charCodeAt to get integer representations of the ASCII chars in byteCharacters
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            //  cast byteNumbers to unsigned 8-bit integer array
            const byteArray = new Uint8Array(byteNumbers);

            // create a blob from this byteArray, formatted as a jpeg image
            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            // create an object url pointing to the blob and overwrite the current image
            setImage(URL.createObjectURL(blob));

            // set file to null to prevent user from calling predict api for no reason
            setFile(null);
        })
    }

    // call this function on the user choosing a local file from the menu
    const uploadFile = (e) => {
        if (e.target.files[0] && e.target.files[0].type === 'image/jpeg') {
            // revoke previous file object url
            URL.revokeObjectURL(file);

            // set the file to the chosen user file which will be sent to the api backend
            setFile(e.target.files[0]);

            // set the image to a pointer to the blob itself, which will be used to render
            // the image on the screen
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    return (
        <div>
            {/* Hero component */}
            <div className="hero is-primary">
                <div className="hero-body">
                    <p className="title">
                        Object Detection Capstone Project
                    </p>
                    <p className="subtitle">
                        Created by Scott Gibson
                    </p>
                </div>
            </div>

            {/* left column: image, right column: api output */}
            <div className='columns is-mobile mt-4'>
                {/* left column */}
                <div className='column'>
                    <figure className='image block user-image'>
                        <img src={image ? image : carImg} alt='prediction'></img>
                    </figure>

                    {<div className='file is-warning'>
                        {/* Upload button */}
                        <label className='file-label'>
                            <input className="file-input" type="file" onChange={uploadFile} />
                            <span className='file-cta'>
                                Upload
                            </span>
                        </label>
                        {/* Predict button */}
                        <button className='button is-success ml-2' onClick={queryDetectApi} disabled={!file}>
                            Predict
                        </button>
                    </div>}
                </div>

                {/* right column */}
                <div className='column'>
                    <p className='title'>Click upload to choose an image, then hit 'Predict'</p>
                    <p className='title'>Confidence threshold set to: 0.5</p>
                </div>
            </div>
        </div >
    );
}

export default App;
