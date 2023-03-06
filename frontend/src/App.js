import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs'
import * as cocossd from '@tensorflow-models/coco-ssd';

import './styles/mystyles.css';

const App = () => {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [model, setModel] = useState(null);

    useEffect(() => {
        loadModel().then((model) => {
            setIsLoading(false);
            setModel(model);
        });
    }, []);

    useEffect(() => {
        if (image == null) return;
        setImageURL(URL.createObjectURL(image));
    }, [image]);


    const loadModel = async () => {
        const model = await cocossd.load();
        return model;
    }

    const onImageChange = (e) => {
        setImage(e.target.files[0]);
    }


    const handlePredict = () => {
        const img = document.getElementById('img');
        model.detect(img).then(predictions => {
            console.log('prediction: ', predictions);
        })
    }


    return (
        <div>
            {/* Hero component */}
            <div className='hero is-primary'>
                <div className='hero-body'>
                    <p className='title'>
                        Object Detection Capstone Project
                    </p>
                    <p className='subtitle'>
                        Created by Scott Gibson
                    </p>
                </div>
            </div>

            {/* Columns */}
            <div className='columns is-mobile mt-4'>
                {/* left column - Image Input and User Buttons */}
                <div className='column'>
                    {/* User Uploaded Image */}
                    <figure className='image block is-square'>
                        <img src={imageURL} alt='user' id='img'></img>
                    </figure>

                    <div className='file is-warning'>
                        {/* Image File Input */}
                        <label className='file-label'>
                            <input className='file-input'
                                type='file'
                                accept='image/*'
                                name='input-image'
                                onChange={onImageChange}
                            />
                            <span className='file-cta'>
                                {/* <span className='file-icon'>
                                    <i className='fas fa-upload'></i>
                                </span> */}
                                <span className='file-label'>
                                    Upload
                                </span>
                            </span>
                        </label>
                        {/* Predict Button */}
                        <button className='button is-success ml-2' onClick={handlePredict}>
                            Predict
                        </button>
                    </div>
                </div>

                {/* right column - Nothing yet */}
                <div className='column'>
                    <p className='title'>Unused Column</p>
                    <p>{isLoading ? 'Loading model...' : 'Model Loaded'}</p>
                </div>
            </div>
        </div >
    );
}

export default App;
